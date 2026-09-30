import React from 'react';
import { Html, Head, Body, Container, Heading, Text, Section, Hr, Img, Button } from '@react-email/components';

export default function CounterOfferReceived({ productName, amount, offerMessage, senderName, senderEmail, productUrl }) {
  const brandColor = '#111111';
  const grayText = '#4b5563';
  const borderColor = '#e5e7eb';
  const buttonBg = '#111111';
  const buttonText = '#ffffff';

  return React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(
      Body,
      { style: { backgroundColor: '#f7f7f7', margin: '0', fontFamily: 'Arial, sans-serif' } },
      React.createElement(
        Container,
        { style: { margin: '24px auto', padding: '0', maxWidth: '560px', backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${borderColor}` } },
        React.createElement(
          Section,
          { style: { backgroundColor: brandColor, padding: '16px 20px' } },
          React.createElement(Img, { src: 'https://resmoke.es/img/resmoke/logo.png', alt: 'Resmoke', width: 112, height: 28, style: { display: 'block', filter: 'invert(1)' } })
        ),
        React.createElement(
          Section,
          { style: { padding: '20px' } },
          React.createElement(
            Heading,
            { style: { fontSize: '20px', fontWeight: '700', color: '#111111', margin: '0 0 12px 0' } },
            'Has recibido una contraoferta'
          ),
          React.createElement(
            Text,
            { style: { fontSize: '14px', color: grayText, lineHeight: '1.7', margin: '0 0 16px 0' } },
            'Un usuario te ha enviado una contraoferta por tu producto.'
          ),
          React.createElement(
            Section,
            { style: { border: `1px solid ${borderColor}`, borderRadius: '10px', padding: '14px', marginBottom: '16px' } },
            React.createElement(Text, { style: { fontSize: '14px', color: '#111111', margin: '0 0 8px 0' } }, `Producto: ${productName}`),
            React.createElement(Text, { style: { fontSize: '14px', color: '#111111', margin: '0 0 8px 0' } }, `Contraoferta: €${amount}`),
            React.createElement(Text, { style: { fontSize: '14px', color: '#111111', margin: '0 0 8px 0' } }, `Usuario: ${senderName}${senderEmail ? ` · ${senderEmail}` : ''}`),
            offerMessage ? React.createElement(Text, { style: { fontSize: '14px', color: grayText, margin: '0' } }, `Mensaje: ${offerMessage}`) : null
          ),
          React.createElement(
            Section,
            { style: { textAlign: 'center', marginTop: '8px' } },
            React.createElement(Button, { href: productUrl || 'https://resmoke.es', style: { display: 'inline-block', backgroundColor: buttonBg, color: buttonText, padding: '10px 16px', borderRadius: '8px', fontSize: '14px', textDecoration: 'none' } }, 'Ver producto')
          ),
          React.createElement(Hr, { style: { borderColor: borderColor, margin: '20px 0' } }),
          React.createElement(Text, { style: { fontSize: '12px', color: grayText, textAlign: 'center', margin: 0 } }, 'Resmoke')
        )
      )
    )
  );
}
