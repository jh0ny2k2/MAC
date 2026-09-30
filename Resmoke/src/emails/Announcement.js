import React from 'react';
import { Html, Head, Body, Container, Heading, Section, Hr, Text, Img } from '@react-email/components';

export default function Announcement({ title, message, recipientName, senderName }) {
  const brandColor = '#111111';
  const grayText = '#4b5563';
  const borderColor = '#e5e7eb';
  const logoSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="112" height="28" viewBox="0 0 112 28"><rect width="112" height="28" fill="none"/><text x="0" y="20" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="white">Resmoke</text></svg>';
  const logoSrc = 'data:image/svg+xml;utf8,' + encodeURIComponent(logoSvg);

  const processedMessage = String(message || '')
    .replace(/\{\{Nombre\}\}/g, recipientName || '')
    .replace(/\{\{Tu nombre\}\}/g, senderName || 'Resmoke');

  return React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(
      Body,
      { style: { backgroundColor: '#f7f7f7', margin: '0', fontFamily: 'Arial, sans-serif' } },
      React.createElement(
        Container,
        { style: { margin: '24px auto', padding: '0', maxWidth: '600px', backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${borderColor}` } },
        React.createElement(
          Section,
          { style: { backgroundColor: brandColor, padding: '18px 24px', textAlign: 'center' } },
          React.createElement('div', { style: { display: 'inline-block' } },
            React.createElement(Img, { src: logoSrc, alt: 'Resmoke', width: 112, height: 28, style: { display: 'inline-block', verticalAlign: 'middle' } }),
            React.createElement('span', { style: { color: '#ffffff', fontSize: '14px', fontWeight: 700, marginLeft: 8, verticalAlign: 'middle', display: 'inline-block' } }, 'RESMOKE')
          )
        ),
        React.createElement(
          Section,
          { style: { padding: '24px' } },
          React.createElement(
            Heading,
            { style: { fontSize: '20px', fontWeight: '700', color: '#111111', margin: '0 0 16px 0', textAlign: 'center' } },
            title || 'Anuncio de Resmoke'
          ),
          React.createElement(
            'div',
            { style: { fontSize: '14px', color: grayText, lineHeight: '1.7', margin: '0' }, dangerouslySetInnerHTML: { __html: processedMessage } }
          ),
          React.createElement(Hr, { style: { borderColor: borderColor, margin: '20px 0' } }),
          React.createElement(Text, { style: { fontSize: '12px', color: grayText, textAlign: 'center', margin: 0 } }, senderName ? `Saludos, ${senderName}` : 'Resmoke')
        )
      )
    )
  );
}
