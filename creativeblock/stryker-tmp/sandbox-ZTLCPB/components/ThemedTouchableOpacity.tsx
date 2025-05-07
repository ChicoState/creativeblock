import { TouchableOpacity, type TouchableOpacityProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTouchableOpacityProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedTouchableOpacity({ style, lightColor, darkColor, ...otherProps }: ThemedTouchableOpacityProps) {
    const styles = StyleSheet.create({
        button: {
            backgroundColor: useThemeColor({ light: lightColor, dark: darkColor }, 'background'),
            borderColor: useThemeColor({ light: lightColor, dark: darkColor }, 'text'),

        },
    });
    return <TouchableOpacity style={[styles.button, style]} {...otherProps}></TouchableOpacity>
}
