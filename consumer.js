const amqp = require('amqplib'); // Import library amqp
const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

amqp.connect('amqp://localhost')
    .then(conn => {
        return conn.createChannel().then(ch => {
            // Deklarasi antrian 'queue1'
            const queue1 = ch.assertQueue('queue1', {
                durable: false
            });

            if (queue1) {
                queue1.then(() => {
                        // Menangkap pesan yang dikirimkan oleh RabbitMQ ke 'queue1'
                        return ch.consume('queue1', psn => {
                            const pesan = psn.content.toString();
                            console.log('- Menerima', pesan);

                            // Menanggapi HTTP request dengan pesan yang diterima
                            app.get('/queue1', (req, res) => {
                                res.json({
                                    pesan
                                });
                            });
                        }, {
                            noAck: true
                        });
                    })
                    .then(() => {
                        console.log('* Menunggu pesan di queue1. Tekan Ctrl+C untuk keluar');
                    });
            }

            // Deklarasi antrian 'queue2'
            const queue2 = ch.assertQueue('queue2', {
                durable: false
            });

            if (queue2) {
                queue2.then(() => {
                        // Menangkap pesan yang dikirimkan oleh RabbitMQ ke 'queue2'
                        return ch.consume('queue2', psn => {
                            const data_json = JSON.parse(psn.content.toString());
                            console.log('- Menerima', data_json);
                            console.log(`Nama barangnya ${data_json.nama} dengan harga ${data_json.harga} dan jumlah pesanan sebanyak ${data_json.jumlah} buah`);

                            // Menanggapi HTTP request dengan data JSON yang diterima
                            app.get('/queue2', (req, res) => {
                                res.json(data_json);
                            });
                        }, {
                            noAck: true
                        });
                    })
                    .then(() => {
                        console.log('* Menunggu pesan di queue2. Tekan Ctrl+C untuk keluar');
                    });
            }
        });
    })
    .catch(console.warn);

// Siapkan server HTTP untuk mendengarkan pada port yang ditentukan
app.listen(port, () => {
    // console.log(`Port ${port}`);
});