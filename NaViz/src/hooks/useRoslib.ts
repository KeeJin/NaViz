// src/hooks/useRosBridgeClient.ts

import * as ROSLIB from "roslib";

import { useState, useEffect, useCallback } from "react";

interface Topic {
  name: string;
  type: string;
}

interface UseRosBridgeClientOptions {
  url: string;
  interval?: number; // Interval in milliseconds for refreshing data
}

const useRosBridgeClient = ({
  url,
  interval = 1000,
}: UseRosBridgeClientOptions) => {
  const [client, setClient] = useState<ROSLIB.Ros | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [subscriptions, setSubscriptions] = useState<
    Map<string, { topic: ROSLIB.Topic; callback: (message: any) => void }>
  >(new Map());

  useEffect(() => {
    const ros = new ROSLIB.Ros({
      url,
    });
    ros.on("connection", () => {
      console.log("Connected to websocket server");
    });
    ros.on("error", (error: any) => {
      console.log("Error connecting to websocket server: ", error);
    });
    ros.on("close", () => {
      console.log("Connection to websocket server closed");
    });

    setClient(ros);

    return () => {
      ros.close();
    };
  }, [url]);

  /**
   * Utility to compare arrays for equality.
   */
  const arraysAreEqual = <T>(a: T[], b: T[], key: keyof T): boolean => {
    if (a.length !== b.length) return false;
    return a.every((item, index) => item[key] === b[index][key]);
  };

  const fetchTopics = useCallback(() => {
    if (client) {
      client.getTopics((result: { topics: string[]; types: string[] }) => {
        if (!result) return;
        if (!result.topics || !result.types) return;
        const newTopics: Topic[] = result.topics.map((name, index) => ({
          name,
          type: result.types[index],
        }));

        if (!arraysAreEqual(newTopics, topics, "name")) {
          setTopics(newTopics);
          console.log("Updated topics:", newTopics);
        }
      });
    }
  }, [client, topics]);

  const fetchServices = useCallback(() => {
    if (client) {
      client.getServices((result: string[]) => {
        if (JSON.stringify(result) !== JSON.stringify(services)) {
          setServices(result);
          console.log("Updated services:", result);
        }
      });
    }
  }, [client, services]);

  const fetchActions = useCallback(() => {
    if (client) {
      client.getActionServers((result: string[]) => {
        if (JSON.stringify(result) !== JSON.stringify(actions)) {
          setActions(result);
          console.log("Updated actions:", result);
        }
      });
    }
  }, [client, actions]);

  /**
   * Periodically fetch data based on the interval.
   */
  useEffect(() => {
    if (interval && client) {
      const timer = setInterval(() => {
        console.log("Fetching data...");
        fetchTopics();
        fetchServices();
        fetchActions();
      }, interval);

      return () => clearInterval(timer);
    }
  }, [client, interval, fetchTopics, fetchServices, fetchActions]);

  const subscribeToTopic = useCallback(
    (
      topicName: string,
      messageType: string,
      callback: (message: any) => void,
    ) => {
      if (client) {
        const topic = new ROSLIB.Topic({
          ros: client,
          name: topicName,
          messageType,
        });

        topic.subscribe(callback);
        setSubscriptions((prev) => {
          const newSubscriptions = new Map(prev);
          newSubscriptions.set(topicName, { topic, callback });
          return newSubscriptions;
        });

        return () => {
          topic.unsubscribe(callback);
        };
      } else {
        console.error("ROS client is not initialized");
        return () => {};
      }
    },
    [client],
  );

  const unsubscribeFromTopic = useCallback(
    (topicName: string) => {
      const subscription = subscriptions.get(topicName);
      if (!subscription) {
        console.warn(`No active subscription found for topic: ${topicName}`);
        return;
      }

      const { topic, callback } = subscription;

      console.log(`Subscription exists. Unsubscribing from ${topicName}`);
      topic.unsubscribe(callback);
      setSubscriptions((prev) => {
        const newSubscriptions = new Map(prev);
        newSubscriptions.delete(topicName);
        return newSubscriptions;
      });
      console.log(`Unsubscribed from ${topicName}`);
    },
    [subscriptions],
  );

  return {
    client,
    topics,
    services,
    actions,
    fetchTopics,
    fetchServices,
    fetchActions,
    subscribeToTopic,
    unsubscribeFromTopic,
  };
};

export default useRosBridgeClient;
