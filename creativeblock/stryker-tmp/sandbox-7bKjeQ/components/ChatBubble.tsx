import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

type ChatUser = {
  _id: number;
  name: string;
  avatar?: string;
};

type IMessage = {
  _id: number;
  text: string;
  createdAt: Date;
  user: ChatUser;
};

const BOT: ChatUser = {
  _id: 0,
  name: 'DeepSeek',
  avatar: 'https://cdn.deepseek.com/platform/favicon.png',
};

const YOU: ChatUser = {
  _id: 1,
  name: 'You',
};

const DEEPSEEK_API_URL =
  'https://api.deepseek.com/v1/chat/completions'; // baseURL + route
const DEEPSEEK_API_KEY = 'sk-2f8bbae12ec14d6a9f1b442d9427b7ed'; // ← secure in .env for prod

export default function ChatBubble() {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // initial “welcome” message
  useEffect(() => {
    setMessages([
      {
        _id: Date.now(),
        text: 'Type your question or share what’s on your mind…',
        createdAt: new Date(),
        user: BOT,
      },
    ]);
  }, []);

  /* ------------------------------------------------------------------ */
  /*                           SEND TO DEEPSEEK                         */
  /* ------------------------------------------------------------------ */
  const sendMessageToDeepSeek = async (userMsg: IMessage) => {
    setLoading(true);

    try {
      const res = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat', // or 'deepseek-reasoner'
          messages: [{ role: 'user', content: userMsg.text }],
        }),
      });

      if (!res.ok) {
        const errTxt = await res.text();
        throw new Error(
          `DeepSeek error (${res.status}): ${errTxt.slice(0, 200)}…`,
        );
      }

      const data = await res.json();
      const aiText =
        data.choices?.[0]?.message?.content?.trim() ||
        '🤖 (no response from DeepSeek)';

      const aiMessage: IMessage = {
        _id: Date.now() + 1,
        text: aiText,
        createdAt: new Date(),
        user: BOT,
      };

      setMessages(prev => [aiMessage, ...prev]);
    } catch (err: any) {
      console.error('DeepSeek API Error:', err);
      Alert.alert('DeepSeek Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /*                              UI LOGIC                              */
  /* ------------------------------------------------------------------ */
  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const userMessage: IMessage = {
      _id: Date.now(),
      text: trimmed,
      createdAt: new Date(),
      user: YOU,
    };

    // add user msg locally
    setMessages(prev => [userMessage, ...prev]);
    setInputText('');

    // fire off to deepseek
    sendMessageToDeepSeek(userMessage);
  };

  return (
    <>
      {/* floating FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setVisible(true)}>
        <Text style={styles.fabText}>Chat</Text>
      </TouchableOpacity>

      {/* modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ThemedView style={styles.chatContainer}>
            <ThemedText type="title" style={styles.chatTitle}>
              DeepSeek Chat
            </ThemedText>

            {loading && (
              <ActivityIndicator style={{ marginBottom: 6 }} size="small" />
            )}

            <FlatList
              inverted
              data={messages}
              keyExtractor={item => item._id.toString()}
              renderItem={({ item }) => {
                const isUser = item.user._id === YOU._id;
                return (
                  <View
                    style={[
                      styles.messageBubble,
                      isUser ? styles.userBubble : styles.botBubble,
                    ]}
                  >
                    <ThemedText style={styles.messageText}>
                      {item.text}
                    </ThemedText>
                  </View>
                );
              }}
              style={styles.messagesList}
            />

            {/* input */}
            <View style={styles.inputRow}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type your question..."
                style={styles.input}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={handleSend}
                style={styles.sendButton}
                disabled={loading}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
    </>
  );
}

/* ------------------------------ styles ----------------------------- */
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#4A90E2',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  fabText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  chatContainer: {
    margin: 20,
    borderRadius: 10,
    padding: 15,
    maxHeight: '80%',
  },
  chatTitle: { textAlign: 'center', marginBottom: 6 },
  messagesList: { flexGrow: 0, maxHeight: 300, marginBottom: 10 },
  messageBubble: { marginVertical: 4, padding: 10, borderRadius: 8 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#add8e6' },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#d3d3d3' },
  messageText: { fontSize: 16 },
  inputRow: { flexDirection: 'row' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 6,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'red',
    borderRadius: 6,
    alignItems: 'center',
    paddingVertical: 8,
  },
  closeButtonText: { color: '#fff', fontWeight: 'bold' },
});

