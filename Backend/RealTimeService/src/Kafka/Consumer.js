import { Kafka } from "kafkajs";
import { notificationPushingHandler } from "./Handlers/NotificationPushingHandler.js";
import { chatRoomCreationHandler } from "./Handlers/ChatRoomCreationHandler.js";
import { chatRoomJoiningHandler } from "./Handlers/ChatRoomJoiningHandler.js";
import { chatRoomLeavingHandler } from "./Handlers/ChatRoomLeavingHandler.js";
import { chatRoomDeletingHandler } from "./Handlers/ChatRoomDeletingHandler.js";

const kafka = new Kafka({
    clientId: "multi-consumer",
    brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({groupId: "realtime-group"});

const notificationTopic = process.env.KAFKA_NOTIFICATION_TOPIC || "notification_push";

// Kafka topic
const topics = ["notification_topic", "chat_topic"];

// Events registration
// key = event name
// value = event handler
const handlers = {
    NOTIFICATION_PUSH: notificationPushingHandler,
    CREATE_CHATROOM: chatRoomCreationHandler,
    JOIN_CHATROOM: chatRoomJoiningHandler,
    LEAVE_CHATROOM: chatRoomLeavingHandler,
    DELETE_CHATROOM: chatRoomDeletingHandler,
};

const run = async () => {
    try {
        await consumer.connect();
        console.log("✅ [KAFKA] Connected");

        // subscribe topic
        for (const topic of topics) {
            if (!topic || topic === "undefined") {
                console.error(`❌ [KAFKA] topic ${topic} haven't set yet`);
            }
            console.log(`📨 [KAFKA] Listening to topic: "${topic}"`);
            await consumer.subscribe({topic, fromBeginning: true})
        }

        // consumer
        await consumer.run({
            eachMessage: async ({topic, partition, message}) => {
                try {
                    console.log(`\n📬 [KAFKA] Recieved message from topic: "${topic}" (partition ${partition})`);
                
                    if (!message.value) {
                        throw new Error("Message empty");
                    }

                    // Raw message
                    const value = message.value.toString();
                    // Parsed message (JSON)
                    const data = JSON.parse(value);

                    if (!data.eventName || !data.message) {
                        throw new Error(`Inappropriate data, data: ${data}`);
                    }

                    // Handle corresponding event with related message
                    const handler = handlers[data.eventName];
                    if (handler) {
                        console.log(data.message)
                        await handler(data.message);
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