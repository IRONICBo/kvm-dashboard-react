import zh from '../i18n/zh.json';

function translateKey(key) {
  const parts = key.split('.');
  const translatedParts = parts.map((part) => {
    const translatedPart = zh[part];
    return translatedPart !== undefined ? translatedPart : part;
  });

  return translatedParts.join('.');
}


export default translateKey;