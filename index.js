const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const ffmpeg = require('fluent-ffmpeg');
const readline = require('readline');
const path = require('path');
const fs = require('fs');
const {Base64} = require('js-base64');

app.use(cors());
app.listen(4000, () => {
  console.log('Server Works !!! At port 4000');
});

app.get('/', (req, res) => {
  res.send('Youtube mp3 - mp4 downloader');
});

app.get('/download', (req, res) => {

  try {
    const url = req.query.url;
    console.log(`url=${url}`)

    let title = req.query.title;
    console.log(`title=${title}`);

    try {
      title = Base64.decode(title);
    } catch(e) {
      console.error('Error decode uri:', e);
    }
    
    title = title.replace('\/', ' ');

    res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);

    /*
    ytdl(URL, {
        format: 'mp4'
    }).pipe(res);
    */

    const fileSender = () => {
      console.log('Start downloading file');
      const filePath = path.join(__dirname, `${title}.mp3`);
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
      console.log('End downloading file');
    };

    if (fs.existsSync(`${title}.mp3`)) {
      fileSender()
    } else {
      const stream = ytdl(url, {
        quality: 'highestaudio',
      });
  
      let start = Date.now();
      ffmpeg(stream)
        .audioBitrate(128)
        .save(`${__dirname}/${title}.mp3`)
        .on('progress', p => {
          readline.cursorTo(process.stdout, 0);
          process.stdout.write(`${p.targetSize}kb downloaded`);
        })
        .on('end', () => {
          console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
  
          fileSender();
        });
    }
  } catch (e) {
    console.error('Error processing file:', e);
  }

});