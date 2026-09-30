exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { Resend } = require('resend');
    const { render } = require('@react-email/render');
    const React = require('react');
    const path = require('path');
    const { pathToFileURL } = require('url');
    const loadEmailComponent = async (relativePath) => {
      try {
        const abs = path.join(__dirname, relativePath);
        const mod = await import(pathToFileURL(abs).href);
        return mod.default || mod;
      } catch (_) {
        return null;
      }
    };

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'RESEND_API_KEY no configurada' })
      };
    }

    let payload = {};
    try {
      payload = JSON.parse(event.body || '{}');
    } catch (e) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'JSON inválido' })
      };
    }

    const { to, template, props, subject, recipients } = payload;
    if ((!to && !Array.isArray(recipients)) || !template) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Parámetros inválidos' })
      };
    }

    let html;
    switch (template) {
      case 'unread_message_notification':
        const UnreadMessageNotification = await loadEmailComponent('../../src/emails/UnreadMessageNotification.js');
        if (!UnreadMessageNotification) {
          return {
            statusCode: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Plantilla no disponible' })
          };
        }
        html = await render(React.createElement(UnreadMessageNotification, props || {}));
        break;
      case 'counter_offer_received':
        const CounterOfferReceived = await loadEmailComponent('../../src/emails/CounterOfferReceived.js');
        if (!CounterOfferReceived) {
          return {
            statusCode: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Plantilla no disponible' })
          };
        }
        html = await render(React.createElement(CounterOfferReceived, props || {}));
        break;
      case 'product_added':
        {
          const ProductAdded = await loadEmailComponent('../../src/emails/ProductAdded.js');
          if (ProductAdded) {
            html = await render(React.createElement(ProductAdded, props || {}));
          } else {
            const brandColor = '#111111';
            const grayText = '#6b7280';
            const borderColor = '#e5e7eb';
            const productName = props?.productName || 'Producto';
            const price = props?.price || '-';
            const categoryName = props?.categoryName || '';
            const location = props?.location || '';
            const uploaderName = props?.uploaderName || '';
            const uploaderEmail = props?.uploaderEmail ? ` · ${props.uploaderEmail}` : '';
            const productUrl = props?.productUrl || 'https://resmoke.es';
            html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Nuevo producto añadido</title></head><body style="background:#f9fafb;margin:0;font-family:Arial,sans-serif"><div style="margin:32px auto;max-width:560px;background:#fff;border-radius:14px;overflow:hidden;border:1px solid ${borderColor};box-shadow:0 4px 16px rgba(0,0,0,0.05)"><div style="background:${brandColor};padding:18px 24px;text-align:center"><span style="color:#fff;font-weight:700">Resmoke</span></div><div style="padding:28px 24px"><h1 style="font-size:22px;font-weight:700;color:${brandColor};text-align:center;margin:0 0 12px 0">Nuevo producto añadido</h1><p style="font-size:15px;color:${grayText};text-align:center;margin:0 0 20px 0">Se ha registrado un nuevo producto en la plataforma Resmoke.</p><div style="border:1px solid ${borderColor};border-radius:12px;padding:18px;background:#fdfdfd;margin-bottom:20px"><p style="margin:0 0 10px 0;color:${brandColor}"><strong>Nombre:</strong> ${productName}</p><p style="margin:0 0 10px 0;color:${brandColor}"><strong>Precio:</strong> €${price}</p><p style="margin:0 0 10px 0;color:${brandColor}"><strong>Categoría:</strong> ${categoryName}</p><p style="margin:0 0 10px 0;color:${brandColor}"><strong>Localización:</strong> ${location}</p><p style="margin:0;color:${brandColor}"><strong>Usuario:</strong> ${uploaderName}${uploaderEmail}</p></div><div style="text-align:center;margin-bottom:12px"><a href="${productUrl}" style="display:inline-block;background:${brandColor};color:#fff;padding:12px 18px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">Ver producto</a></div><div style="text-align:center"><a href="https://resmoke.es/admin/productos/confirmaciones" style="display:inline-block;background:#374151;color:#fff;padding:12px 18px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">Ver productos por confirmar</a></div><hr style="border:0;border-top:1px solid ${borderColor};margin:26px 0"><p style="font-size:12px;color:${grayText};text-align:center;margin:0">© ${new Date().getFullYear()} Resmoke — Todos los derechos reservados.</p></div></div></body></html>`;
          }
        }
        break;
      case 'announcement':
        {
          const Announcement = await loadEmailComponent('../../src/emails/Announcement.js');
          if (Announcement) {
            html = await render(React.createElement(Announcement, props || {}));
          } else {
            const brandColor = '#111111';
            const grayText = '#4b5563';
            const borderColor = '#e5e7eb';
            const logoSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="112" height="28" viewBox="0 0 112 28"><rect width="112" height="28" fill="none"/><text x="0" y="20" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="white">Resmoke</text></svg>';
            const logoSrc = 'data:image/svg+xml;utf8,' + encodeURIComponent(logoSvg);
            const processedMessage = String(props?.message || '')
              .replace(/\{\{Nombre\}\}/g, props?.recipientName || '')
              .replace(/\{\{Tu nombre\}\}/g, props?.senderName || 'Resmoke');
            const title = props?.title || 'Anuncio de Resmoke';
            html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title></head><body style="background-color:#f7f7f7;margin:0;font-family:Arial,sans-serif"><div style="margin:24px auto;padding:0;max-width:600px;background:#fff;border-radius:12px;overflow:hidden;border:1px solid ${borderColor}"><div style="background:${brandColor};padding:18px 24px;text-align:center"><span style="display:inline-block;vertical-align:middle"><img src="${logoSrc}" alt="Resmoke" width="112" height="28" style="display:inline-block;vertical-align:middle"></span><span style="color:#fff;font-size:14px;font-weight:700;margin-left:8px;vertical-align:middle;display:inline-block">RESMOKE</span></div><div style="padding:24px"><h1 style="font-size:20px;font-weight:700;color:#111;margin:0 0 16px 0;text-align:center">${title}</h1><div style="font-size:14px;color:${grayText};line-height:1.7;margin:0">${processedMessage}</div><hr style="border:0;border-top:1px solid ${borderColor};margin:20px 0"><p style="font-size:12px;color:${grayText};text-align:center;margin:0">${props?.senderName ? `Saludos, ${props.senderName}` : 'Resmoke'}</p></div></div></body></html>`;
          }
        }
        break;
      case 'counter_offer_accepted':
        const CounterOfferAccepted = await loadEmailComponent('../../src/emails/CounterOfferAccepted.js');
        if (!CounterOfferAccepted) {
          return {
            statusCode: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Plantilla no disponible' })
          };
        }
        html = await render(React.createElement(CounterOfferAccepted, props || {}));
        break;
      default:
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'Plantilla no encontrada' })
        };
    }

    const resend = new Resend(resendApiKey);
    const from = process.env.EMAIL_FROM || 'Resmoke <onboarding@resend.dev>';
    const replyTo = (props && props.uploaderEmail) ? String(props.uploaderEmail) : undefined;

    // Envío personalizado por destinatario para 'announcement'
    if (template === 'announcement' && Array.isArray(recipients) && recipients.length > 0) {
      const ids = [];
      const errors = [];
      for (const r of recipients) {
        try {
          const component = React.createElement(Announcement, {
            ...(props || {}),
            title: subject,
            recipientName: r.recipientName || '',
            senderName: (props && props.senderName) || '',
          });
          const htmlPerRecipient = await render(component);
          const result = await resend.emails.send({ from, to: [r.email], subject: subject || 'Notificación Resmoke', html: htmlPerRecipient, reply_to: replyTo });
          const id = result?.id || result?.data?.id || null;
          if (id) ids.push(id);
          if (result?.error) errors.push({ email: r.email, error: result.error });
          await new Promise(resolve => setTimeout(resolve, 150));
        } catch (e) {
          errors.push({ email: r.email, error: e.message });
        }
      }
      if (errors.length > 0 && ids.length === 0) {
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ success: false, errors })
        };
      }
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ success: errors.length === 0, ids, errors })
      };
    }

    // Envío estándar (no personalizado)
    const result = await resend.emails.send({ from, to, subject: subject || 'Notificación Resmoke', html, reply_to: replyTo });
    const id = result?.id || result?.data?.id || null;
    const error = result?.error || null;
    if (error) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ success: false, error })
      };
    }
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ success: true, id })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
