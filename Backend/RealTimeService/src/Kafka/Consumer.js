import { Kafka } from "kafkajs";
import { notificationPushingHandler } from "./Handlers/NotificationPushingHandler.js";

const kafka = new Kafka({
    clientId: "multi-consumer",
    brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({groupId: "realtime-group"});

const notificationTopic = process.env.KAFKA_NOTIFICATION_TOPIC || "notification_push";

// key = topic
// value = event handler
const handlers = {
    notification_push: notificationPushingHandler
};

const run = async () => {
    try {
        await consumer.connect();
        console.log("✅ [KAFKA] Connected");

        // subscribe topic
        for (const topic of Object.keys(handlers)) {
            if (!topic || topic === "undefined") {
                console.error(`❌ [KAFKA] topic ${topic} haven't set yet`);
            }
            console.log(`📨 [KAFKA] Listening to topic: "${topic}"`);
            await consumer.subscribe({topic, fromBeginning: true})
        }

        // consumer
        await consumer.run({
            eachMessage: async ({topic, partition, message}) => {
                console.log(`\n📬 [KAFKA] Recieved message from topic: "${topic}" (partition ${partition})`);
                
                if (!message.value) {
                    console.warn("⚠️  [KAFKA] Message empty");
                    return;
                }

                // Raw message
                const value = message.value.toString();

                try {
                    // Parsed message (JSON)
                    const data = JSON.parse(value);

                    // Handle corresponding event with related message
                    const handler = handlers[topic];
                    if (handler) {
                        await handler(data);
                    } else {
                        console.warn(`⚠️  [KAFKA] No handler for topic: "${topic}"`);
                        console.warn(`   → Available handlers:`, Object.keys(handlers));
                    }
                } catch (error) {
                    console.error(`❌ [KAFKA] Error: `, error.message);
                    return;
                }
            }
        })
    } catch (error) {
        console.error("❌ [KAFKA] Error:", error.message);
        console.error(error);
        process.exit(1);
    }
}

run().catch(console.error);