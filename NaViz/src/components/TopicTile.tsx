import React from "react";

interface TopicTileProps {
  topicName: string;
  messageType: string;
  isSubscribed: boolean;
  handleSubscribe: (topicName: string, messageType: string) => void;
  handleUnsubscribe: (topicName: string) => void;
}

const TopicTile: React.FC<TopicTileProps> = ({
  topicName,
  messageType,
  isSubscribed,
  handleSubscribe,
  handleUnsubscribe,
}) => {
  return (
    <div className="flex justify-between items-center py-2">
      <div className="text-left">
        <span className="font-semibold text-sm pr-2">{topicName}</span>
        <div className="absolute bottom-full left-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md px-2 py-1">
          Message Type: {messageType}
        </div>
      </div>
      {isSubscribed ? (
        <button
          onClick={() => handleUnsubscribe(topicName)}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
        >
          Unsubscribe
        </button>
      ) : (
        <button
          onClick={() => handleSubscribe(topicName, messageType)}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
        >
          Subscribe
        </button>
      )}
    </div>
  );
};

export default TopicTile;
