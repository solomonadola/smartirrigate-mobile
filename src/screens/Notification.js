import React, { useState, useEffect } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const NofificationScreen = () => {
  const windowWidth = Dimensions.get("window").width;

  const [irrigationNotification, setIrrigationNotification] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("API for data retrival");

      if (response.ok) {
        const data = await response.json();

        setIrrigationNotification(data.IrrigationNotification[0].notification);
      } else {
        throw new Error("No data found");
      }
    } catch (error) {
      Alert.alert("Error", "API not connected", [{ text: "OK" }]);
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "android" && <StatusBar backgroundColor="#1ad766" />}

      <View style={styles.menuContainer}>
        <View style={[styles.circleMenu, { width: windowWidth * 0.8 }]}>
          <View style={styles.circleMenuItem}>
            <FontAwesome
              name="bell"
              size={24}
              color="white"
              style={styles.bellIcon}
            />
            <Text style={styles.circleMenuItemText}>Notifications</Text>
            <Text style={styles.measurementValue}>
              {irrigationNotification}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },

  menuContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  circleMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1ad766",
    borderRadius: 80,
    padding: 16,
  },
  circleMenuItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  bellIcon: {
    marginBottom: 6,
  },
  circleMenuItemText: {
    color: "#fff",
    marginTop: 8,
  },
  measurementValue: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default NofificationScreen;
