const amqp = require('amqplib'); // Import library amqp

amqp.connect('amqp://localhost')
    .then(conn => {
        return conn.createChannel().then(ch => {
            const pesan = 'Belajar Message Broker'; // Isi pesan yang dikirim ke RabbitMQ
            const data = {
                nama: "Asus ROG",
                harga: "Rp23.000.000",
                jumlah: "1",
            };

            // Memanggil kurir 'queue1'
            const queue1 = ch.assertQueue('queue1', {
                durable: false
            });

            // Mengirim pesan ke kurir 'queue1'
            ch.sendToQueue('queue1', Buffer.from(pesan));
            console.log('- Mengirim', pesan);

            // Memanggil kurir 'queue2'
            const queue2 = ch.assertQueue('queue2', {
                durable: false
            });

            // Mengirim pesan ke kurir 'queue2'
            ch.sendToQueue('queue2', Buffer.from(JSON.stringify(data)));
            console.log('- Mengirim', data);

        }).finally(() => {
            // Tutup koneksi ke RabbitMQ setelah selesai menggunakan.
            setTimeout(() => {
                conn.close();
            }, 500);
        });
    }).catch(console.warn);