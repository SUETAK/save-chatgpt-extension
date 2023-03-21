import React, { ReactElement, useEffect, useState } from 'react';
import { getBucket } from '@extend-chrome/storage';
import { Button, Container, Input, Select } from '@mantine/core';

interface MyBuscket {
  targetLang: string;
}

interface MyLocalBuscket {
  texts: string[];
}

// MyBuscket の型情報を渡す。
const bucket = getBucket<MyBuscket>('my_bucket', 'sync');
const localBucket = getBucket<MyLocalBuscket>('my_local_bucket', 'local');

const Popup = (): ReactElement => {
  document.body.style.width = '15rem';
  document.body.style.height = '15rem';

  const [lang, setLang] = useState('EN');
  const [text, setText] = useState('');
  const [savedTexts, setSavedTexts] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      // await bucket.get() は getBucket でlocalstrage から値を取得する
      const value: MyBuscket = await bucket.get();
      const localValue: MyLocalBuscket = await localBucket.get();
      if (value.targetLang) {
        setLang(value.targetLang);
      }
      if (localValue.texts) {
        setSavedTexts(localValue.texts);
      }
    })();
  }, []);

  const saveLang = (lang: string) => {
    bucket.set({ targetLang: lang });
    setLang(lang);
  };

  const handleSaveText = () => {
    const saveTexts = [...savedTexts, text];
    localBucket.set({ texts: saveTexts });
    setSavedTexts(saveTexts);
  };

  return (
    <Container p="xl">
      <Select
        label="どの言語に翻訳しますか？？？"
        defaultValue="EN"
        value={lang}
        data={[
          { value: 'EN', label: 'えいご' },
          { value: 'JA', label: 'にほんご' },
        ]}
        onChange={(value: string) => saveLang(value)}
      />
      <Input placeholder="プレースホルダー" onChange={(event) => setText(event.target.value)} />
      <Button onClick={handleSaveText}>保存</Button>
      <p>{savedTexts}</p>
    </Container>
  );
};

export default Popup;
