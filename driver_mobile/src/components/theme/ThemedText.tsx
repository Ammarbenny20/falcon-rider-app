// src/components/theme/ThemedText.tsx

import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, type ThemeColor } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextType =
  | 'display'
  | 'title'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'default'
  | 'body'
  | 'bodyBold'
  | 'callout'
  | 'subhead'
  | 'subtitle'
  | 'small'
  | 'smallBold'
  | 'footnote'
  | 'caption'
  | 'link'
  | 'linkPrimary'
  | 'code';

export type ThemedTextProps = TextProps & {
  type?: ThemedTextType;
  themeColor?: ThemeColor;
};

export function ThemedText({
  style,
  type = 'default',
  themeColor = 'text',
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor] },
        styleForType(type),
        style,
      ]}
      {...rest}
    />
  );
}

function styleForType(type: ThemedTextType) {
  switch (type) {
    case 'display':
      return Typography.display;
    case 'title':
      return styles.title;
    case 'title1':
      return Typography.title1;
    case 'title2':
      return Typography.title2;
    case 'title3':
      return Typography.title3;
    case 'default':
      return styles.default;
    case 'body':
      return Typography.body;
    case 'bodyBold':
      return Typography.bodyBold;
    case 'callout':
      return Typography.callout;
    case 'subhead':
      return Typography.subhead;
    case 'subtitle':
      return styles.subtitle;
    case 'small':
      return Typography.small;
    case 'smallBold':
      return Typography.smallBold;
    case 'footnote':
      return Typography.footnote;
    case 'caption':
      return Typography.caption;
    case 'link':
      return styles.link;
    case 'linkPrimary':
      return styles.linkPrimary;
    case 'code':
      return styles.code;
  }
}

const styles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
  title: { fontSize: 48, fontWeight: '600', lineHeight: 52 },
  subtitle: { fontSize: 32, lineHeight: 44, fontWeight: '600' },
  link: { lineHeight: 30, fontSize: 14 },
  linkPrimary: { lineHeight: 30, fontSize: 14, color: '#18A66A' },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: '700', default: '500' }),
    fontSize: 12,
  },
});