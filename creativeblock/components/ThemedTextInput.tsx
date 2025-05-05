import { TextInput, StyleSheet, TextInputProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedTextInput({
    style,
    lightColor,
    darkColor,
    ...rest
}: ThemedTextInputProps) {
    const styles = StyleSheet.create({
        input: {
           // height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
            backgroundColor: '#DDDDDD',
            borderColor: useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'text'),

        },
    });
    return (
        <TextInput style={[styles.input, style]} {...rest} />
    );
}