import React from 'react';
import { Html, Head, Body, Container, Heading, Text, Section, Hr } from '@react-email/components';

export default function CounterOfferAccepted({ productName, amount, sellerName, buyerName }) {
  return React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(
      Body,
      { style: { backgroundColor: '#ffffff', margin: '0', fontFamily: 'Arial, sans-serif' } },
      React.createElement(
        Container,
        { style: { margin: '0 auto', padding: '24px', maxWidth: '520px' } },
        React.createElement(
          Heading,
          { style: { fontSize: '20px', fontWeight: '700', color: '#111111', margin: '0 0 16px 0' } },
          'Contraoferta aceptada'
        ),
        React.createElement(
          Text,
          { style: { fontSize: '14px', color: '#333333', lineHeight: '1.6' } },
          `Se ha aceptado la contraoferta para ${productName}.`
        ),
        React.createElement(
          Section,
          { style: { marginTop: '16px', marginBottom: '16px' } },
          React.createElement(Text, { style: { fontSize: '14px', color: '#111111' } }, `Importe: €${amount}`),
          React.createElement(Text, { style: { fontSize: '14px', color: '#111111' } }, `Vendedor: ${sellerName}`),
          React.createElement(Text, { style: { fontSize: '14px', color: '#111111' } }, `Comprador: ${buyerName}`)
        ),
        React.createElement(Hr, { style: { borderColor: '#e5e7eb', margin: '24px 0' } }),
        React.createElement(Text, { style: { fontSize: '12px', color: '#666666' } }, 'Resmoke')
      )
    )
  );
}