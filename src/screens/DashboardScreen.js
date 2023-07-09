import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  List,
  Avatar,
  Title,
  Caption,
  Divider,
  IconButton,
  DefaultTheme,
} from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

const DashboardScreen = ({ navigation }) => {
  const [humidity, setHumidity] = useState("");
  const [temperature, setTemperature] = useState("");
  const [moisture, setMoisture] = useState("");
  const [humidityLabel, setHumidityLabel] = useState("");
  const [temperatureLabel, setTemperatureLabel] = useState("");
  const [moistureLabel, setMoistureLabel] = useState("");
  const [showSidebar, setShowSidebar] = useState(false); // Added showSidebar state
  const [showNotification, setShowNotification] = useState(false); // Added showSidebar state
  const [lastIrrigationTime, setLastIrrigationTime] = useState("");
  const [nextIrrigationTime, setNextIrrigationTime] = useState("");
  const [nextIrrigationTimeInDet, setNextIrrigationTimeInDet] = useState("");
  const [newNotification, setNewNotification] = useState({});
  const [notificationCount, setNotificationCount] = useState(0);

  // useEffect(() => {
  //   fetchData();
  // }, []);
  setTimeout(() => {
    fetchData();
  }, 0);
  setInterval(() => {
    fetchData();
  }, 30000);
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        "https://smartirrigate.vercel.app/api/sensors/data/",
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );
      const notifications = await fetch(
        "https://smartirrigate.vercel.app/api/notification/new",
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const data2 = await notifications.json();
        const notif = data2.notifications.map(
          (notification) => notification.body
        );

        setNewNotification(notif);
        setHumidityLabel(data.sensorReadings[0].sensor.sensing_type);
        setHumidity(data.sensorReadings[0].reading + "%");
        setTemperatureLabel(data.sensorReadings[1].sensor.sensing_type);
        setTemperature(data.sensorReadings[1].reading + " °C");
        setMoistureLabel(data.sensorReadings[2].sensor.sensing_type);
        setMoisture(data.sensorReadings[2].reading + "%");
        // const date_string = "2023-06-27T12:20:27.363Z";
        // const dt = datetime.datetime.fromisoformat(date_string);
        // const formatted_date = dt.strftime("%a %d %I:%M %p");
        const timestamp2 = data.schedule[1].start_time;
        const timestamp = data.schedule[0].start_time;
        const date = new Date(timestamp);
        const date2 = new Date(timestamp2);

        const nextIrrigationTimeDetail = date.toLocaleString();

        const format1 =
          date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }) +
          "\n" +
          date.toLocaleString("en-US", {
            day: "numeric",
            weekday: "short",
          });

        const format2 =
          date2.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }) +
          "\n" +
          date2.toLocaleString("en-US", {
            day: "numeric",
            weekday: "short",
          });

        setNextIrrigationTime(format1);
        setLastIrrigationTime(format2);
        setNextIrrigationTimeInDet(nextIrrigationTimeDetail);
      } else {
        throw new Error("Connection Error");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "API not connected", [{ text: "OK" }]);
    }
  };
  const handleLogout = async () => {
    // Remove the token from storage
    try {
      // Perform the logout operation, such as destroying the token or making an API call
      await AsyncStorage.removeItem("token");

      // Redirect the user to the login screen or perform any other necessary actions
      navigation.navigate("Login");
    } catch (error) {
      // Handle any errors that occur during the logout process
      navigation.navigate("Login");
    }
    // Navigate back to the login screen
  };
  const onPressMenu = () => {
    setShowNotification(false);
    setShowSidebar(!showSidebar);
  };

  const onBellPress = () => {
    setShowNotification(!showNotification);
    setShowSidebar(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={onPressMenu}>
          <FontAwesome name="bars" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={onBellPress}>
          {notificationCount > 0 && (
            <Text style={styles.notificationPop}>{newNotification.length}</Text>
          )}
          <FontAwesome name="bell" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {showSidebar && (
        <View style={styles.sidebar}>
          <TouchableOpacity style={styles.sidebarOption} onPress={handleLogout}>
            <Text style={styles.sidebarOptionText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {showNotification && (
        <View style={styles.notifContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {newNotification.map((notification, index) => (
              <View
                key={index}
                style={[
                  styles.listItem,
                  index === newNotification.length - 1 && styles.lastItem,
                ]}
              >
                <Caption style={styles.description}>{notification}</Caption>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.info}>
        <View style={styles.circle1}>
          <Text style={styles.label}>Last </Text>
          <View style={styles.bar} />
          <Text style={styles.value}>{lastIrrigationTime}</Text>
        </View>

        <View style={styles.circle2}>
          <Text style={styles.label}>Mode</Text>
          <View style={styles.bar} />
          <Text style={styles.value}>{"auto"}</Text>
        </View>

        <View style={styles.circle1}>
          <Text style={styles.label}>Next </Text>
          <View style={styles.bar} />
          <Text style={styles.value}>{nextIrrigationTime}</Text>
        </View>
      </View>
      <View style={styles.line} />

      <View style={styles.measurementsContainer}>
        <View style={styles.measurement}>
          <Text style={styles.measurementLabel}>{humidityLabel}</Text>
          <Text style={styles.measurementValue}>{humidity}</Text>
        </View>

        <View style={styles.measurement}>
          <Text style={styles.measurementLabel}>{temperatureLabel}</Text>
          <Text style={styles.measurementValue}>{temperature}</Text>
        </View>

        <View style={styles.measurement}>
          <Text style={styles.measurementLabel}>{moistureLabel}</Text>
          <Text style={styles.measurementValue}>{moisture}</Text>
        </View>
        <View style={styles.measurement}>
          <Text style={styles.measurementLabel}>Status</Text>
          <Text style={styles.measurementValue}>
            {parseInt(moisture) > 50 ? "good" : "low"}
          </Text>
        </View>

        <View style={styles.measurement}>
          <Text style={styles.measurementLabel}>Mode</Text>
          <Text style={styles.measurementValue}>Auto</Text>
        </View>

        <View style={styles.measurement}>
          <Text style={styles.measurementLabel}>Schedule</Text>
          <Text style={styles.measurementValue}>{nextIrrigationTimeInDet}</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#1ad766",
    height: 100,
    color: "#fff",
  },
  menuButton: {
    top: 19,
    padding: 8,
    color: "#fff",
  },
  sidebar: {
    borderRadius: 5,
    position: "absolute",
    top: 102,
    left: 0,
    bottom: 0,
    width: "35%",
    height: "15%",
    backgroundColor: "#fff",
    padding: 16,
    zIndex: 10,
    borderWidth: 1,
    borderColor: "#1ad766",
  },
  sidebarOption: {
    marginBottom: 26,
  },
  sidebarOptionText: {
    fontSize: 16,
    color: "#ff0000",
  },
  notifContainer: {
    position: "absolute",
    top: 92,
    zIndex: 10,
    width: "100%",
    height: "85%",
    backgroundColor: "white",
    paddingLeft: 16,
    borderRadius: 8,
    elevation: 3,
  },
  scrollContainer: {
    position: "absolute",
    top: 102,
    zIndex: 15,
    width: "95%",
    flexGrow: 1,
  },
  listItem: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eaeaea",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  description: {
    fontStyle: "italic",
    color: DefaultTheme.colors.primary,
  },
  notificationPop: {
    position: "absolute",
    top: 1,
    right: 5,
    zIndex: 10,
    backgroundColor: "#ff0000",
    color: "#fff",
    width: 30,
    paddingHorizontal: 5,
  },
  listItem: {
    marginBottom: 3,
    borderWidth: 1,
    borderColor: "#1ad766",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  lastItem: {
    marginBottom: 150,
  },
  description: {
    fontStyle: "italic",
    color: DefaultTheme.colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
  },
  measurementsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  measurement: {
    backgroundColor: "#1ad766",
    padding: 16,
    borderRadius: 5,
    alignItems: "center",
    width: "40%",
    margin: 8,
  },
  measurementLabel: {
    textTransform: "capitalize",
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
  },
  measurementValue: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "light",
    marginTop: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 8,
  },
  value: {
    fontSize: 10,
    fontWeight: "light",
    marginTop: 8,
  },
  info: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    top: 30,
  },
  circle1: {
    backgroundColor: "#fff",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#1ad766",
    padding: 16,
    alignItems: "center",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    top: 30,
  },
  circle2: {
    backgroundColor: "#fff",
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#1ad766",
    padding: 16,
    alignItems: "center",
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  wideCircle: {
    width: 150,
  },
  circleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginBottom: 8,
  },
  bar: {
    height: 2,
    width: 60,
    marginTop: 4,
    backgroundColor: "green",
  },
  time: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  mode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    marginTop: 8,
  },
  line: {
    height: 2,
    width: "90%",
    marginLeft: 17,
    marginRight: 5,

    backgroundColor: "#1ad766",
  },
});

export default DashboardScreen;
