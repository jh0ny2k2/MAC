import React from 'react';
import { Html, Head, Body, Container, Heading, Text, Section, Hr, Img, Button } from '@react-email/components';

export default function ProductAdded({ productName, price, categoryName, location, uploaderName, uploaderEmail, productUrl }) {
  const brandColor = '#111111';
  const grayText = '#6b7280';
  const borderColor = '#e5e7eb';
  const buttonBg = brandColor;
  const buttonText = '#ffffff';
  const bgLight = '#f9fafb';

  return React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(
      Body,
      { style: { backgroundColor: bgLight, margin: '0', fontFamily: 'Arial, sans-serif' } },
      React.createElement(
        Container,
        { style: { margin: '32px auto', padding: '0', maxWidth: '560px', backgroundColor: '#ffffff', borderRadius: '14px', overflow: 'hidden', border: `1px solid ${borderColor}`, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' } },
        React.createElement(
          Section,
          { style: { backgroundColor: brandColor, padding: '18px 24px', textAlign: 'center' } },
          React.createElement(Img, { src: 'https://resmoke.es/img/resmoke/logo.png', alt: 'Resmoke', width: 120, height: 32, style: { filter: 'invert(1)' } })
        ),
        React.createElement(
          Section,
          { style: { padding: '28px 24px' } },
          React.createElement(
            Heading,
            { style: { fontSize: '22px', fontWeight: '700', color: brandColor, margin: '0 0 12px 0', textAlign: 'center' } },
            'Nuevo producto añadido'
          ),
          React.createElement(
            Text,
            { style: { fontSize: '15px', color: grayText, lineHeight: '1.7', textAlign: 'center', margin: '0 0 20px 0' } },
            'Se ha registrado un nuevo producto en la plataforma Resmoke.'
          ),
          React.createElement(
            Section,
            { style: { border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '18px', backgroundColor: '#fdfdfd', marginBottom: '20px' } },
            React.createElement(
              Text,
              { style: { margin: '0 0 10px 0', color: brandColor } },
              React.createElement('strong', null, 'Nombre:'),
              ` ${productName}`
            ),
            React.createElement(
              Text,
              { style: { margin: '0 0 10px 0', color: brandColor } },
              React.createElement('strong', null, 'Precio:'),
              ` €${price}`
            ),
            React.createElement(
              Text,
              { style: { margin: '0 0 10px 0', color: brandColor } },
              React.createElement('strong', null, 'Categoría:'),
              ` ${categoryName}`
            ),
            React.createElement(
              Text,
              { style: { margin: '0 0 10px 0', color: brandColor } },
              React.createElement('strong', null, 'Localización:'),
              ` ${location}`
            ),
            React.createElement(
              Text,
              { style: { margin: '0', color: brandColor } },
              React.createElement('strong', null, 'Usuario:'),
              ` ${uploaderName}${uploaderEmail ? ` · ${uploaderEmail}` : ''}`
            )
          ),
          React.createElement(
            Section,
            { style: { textAlign: 'center', marginBottom: '12px' } },
            React.createElement(Button, { href: productUrl || 'https://resmoke.es', style: { display: 'inline-block', backgroundColor: buttonBg, color: buttonText, padding: '12px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' } }, 'Ver producto')
          ),
          React.createElement(
            Section,
            { style: { textAlign: 'center' } },
            React.createElement(Button, { href: 'https://resmoke.es/admin/productos/confirmaciones', style: { display: 'inline-block', backgroundColor: '#374151', color: buttonText, padding: '12px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' } }, 'Ver productos por confirmar')
          ),
          React.createElement(Hr, { style: { borderColor: borderColor, margin: '26px 0' } }),
          React.createElement(Text, { style: { fontSize: '12px', color: grayText, textAlign: 'center', margin: 0 } }, `© ${new Date().getFullYear()} Resmoke — Todos los derechos reservados.`)
        )
      )
    )
  );
}
