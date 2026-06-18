import { Kafka } from "kafkajs";
import { notificationPushingHandler } from "./Handlers/NotificationPushingHandler.js";

const kafka = new Kafka({
    clientId: "multi-consumer",
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({groupId: "realtime-group"});

const notificationTopic = process.env.KAFKA_NOTIFICATION_TOPIC || "notification_push";

const handlers = {
    [notificationTopic]: notificationPushingHandler
};

const run = async () => {
    try {
        await consumer.connect();
        console.log("✅ [KAFKA] Kết nối broker thành công");

        // subscribe topic
        for (const topic of Object.keys(handlers)) {
            if (!topic || topic === "undefined") {
                console.error("❌ [KAFKA] KAFKA_NOTIFICATION_TOPIC không được set");
                console.error("   → Hãy add vào .env: KAFKA_NOTIFICATION_TOPIC=notification_push");
                process.exit(1);
            }
            console.log(`📨 [KAFKA] Đang lắng nghe topic: "${topic}"`);
            await consumer.subscribe({topic, fromBeginning: true})
        }

        console.log("⏳ [KAFKA] Chờ nhận message...\n");

        // consumer
        await consumer.run({
            eachMessage: async ({topic, partition, message}) => {
                console.log(`\n📬 [KAFKA] Nhận message từ topic: "${topic}" (partition ${partition})`);
                
                if (!message.value) {
                    console.warn("⚠️  [KAFKA] Message trống");
                    return;
                }

                const value = message.value.toString();
                console.log(`📋 [KAFKA] Raw message:`, value);

                let data;
                try {
                    data = JSON.parse(value);
                    console.log(`✅ [KAFKA] Parse JSON thành công:`, JSON.stringify(data, null, 2));
                } catch (error) {
                    console.error(`❌ [KAFKA] Lỗi parse JSON:`, error.message);
                    console.error(`   → Raw value:`, value);
                    return;
                }

                const handler = handlers[topic];

                if (handler) {
                    console.log(`🎯 [KAFKA] Gọi handler cho topic: "${topic}"`);
                    await handler(data);
                    console.log(`✅ [KAFKA] Handler thực thi xong\n`);
                } else {
                    console.warn(`⚠️  [KAFKA] Không có handler cho topic: "${topic}"`);
                    console.warn(`   → Available handlers:`, Object.keys(handlers));
                }
            }
        })
    } catch (error) {
        console.error("❌ [KAFKA] Lỗi:", error.message);
        console.error(error);
        process.exit(1);
    }
}

run().catch(console.error);