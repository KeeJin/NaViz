import { useState, useEffect, Suspense } from "react";

import DragAndDrop from "./components/DragAndDrop";
import TopicTile from "./components/TopicTile";
import usePCDParser from "./hooks/usePCDParser";
import useRosBridgeClient from "./hooks/useRoslib";
import Scene from "./Scene";

function App() {
  const { points, parsePCD } = usePCDParser();
  const { topics, services, actions, subscribeToTopic, unsubscribeFromTopic } =
    useRosBridgeClient({ url: "ws://localhost:9090", interval: 1000 });
  const [subscribedTopics, setSubscribedTopics] = useState<Set<string>>(
    new Set(),
  );
  const handleFileUpload = (data: ArrayBuffer) => {
    parsePCD(data);
    console.log("PCD file parsed.");
  };

  const handleSubscribe = (topicName: string, messageType: string) => {
    subscribeToTopic(topicName, messageType, (message) => {
      console.log(`Message from ${topicName}:`, message);
    });
    setSubscribedTopics((prev) => new Set(prev).add(topicName));
  };

  const handleUnsubscribe = (topicName: string) => {
    unsubscribeFromTopic(topicName);
    setSubscribedTopics((prev) => {
      const newSet = new Set(prev);
      newSet.delete(topicName);
      return newSet;
    });
  };

  useEffect(() => {
    console.log("Available Topics:", topics);
  }, [topics]);

  return (
    <div className="items-center justify-center flex h-screen w-full">
      <div className="h-screen w-full">
        <Scene priorMap={points} />
      </div>
      <div className="h-screen w-96 bg-gray-800 text-white">
        <h1 className="text-4xl font-bold p-4">NaViz</h1>
        <p className="p-4">
          NaViz is a 3D visualization tool for understanding navigation
          algorithms. It is built using React Three Fiber and Drei.
        </p>
        <p className="p-4">
          To begin, drag and drop a point cloud map (.pcd) file here:
        </p>
        <div className="p-4">
          <DragAndDrop onFileUpload={handleFileUpload} />
        </div>
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Topics</h1>

          {/* Topics List */}
          <Suspense fallback={<h1 className="text-xl font-bold mb-4">Loading...</h1>}>
          <ul className="bg-gray-600 rounded-md px-2 max-h-[30vh] overflow-y-auto">
            {topics.map((topic) => (
              <li key={topic.name}>
                <TopicTile
                  topicName={topic.name}
                  messageType={topic.type}
                  isSubscribed={subscribedTopics.has(topic.name)}
                  handleSubscribe={handleSubscribe}
                  handleUnsubscribe={handleUnsubscribe}
                />
              </li>
            ))}
          </ul>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default App;
