// components/DeepSeekChat.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import axios from 'axios';

const DEEPSEEK_API_KEY = 'sk-66c6d2065e6e49f78edcdb57a3c90e8d';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export default function DeepSeekChat({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setMessages([
        {
          _id: 1,
          text: 'Hi! Ask me anything.',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'DeepSeek',
            avatar: 'https://cdn.deepseek.com/platform/favicon.png',
          },
        },
      ]);
    }
  }, [visible]);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    const userMessage = newMessages[0];
    setMessages(prev => GiftedChat.append(prev, newMessages));
    setLoading(true);

    try {
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: userMessage.text },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const reply = response.data.choices?.[0]?.message?.content ?? 'No response available.';

      setMessages(prev =>
        GiftedChat.append(prev, [
          {
            _id: Math.random().toString(),
            text: reply,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'DeepSeek',
              avatar: 'https://cdn.deepseek.com/platform/favicon.png',
            },
          },
        ])
      );
    } catch (error) {
      console.error('DeepSeek API Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={msgs => onSend(msgs)}
        user={{ _id: 1 }}
        isTyping={loading}
        showAvatarForEveryMessage
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 10,
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height * 0.5,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: '#ccc',
    borderWidth: 1,
    zIndex: 999,
  },
});

