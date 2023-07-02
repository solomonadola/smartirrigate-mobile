import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import DashboardScreen from "./DashboardScreen";
const LoginScreen = ({ navigation }) => {
  const [serial_number, setSerialNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(token !== null);
    };

    checkLoginStatus();
  }, []);

  if (isLoggedIn) {
    return <DashboardScreen />;
  }

  const handleLogin = async () => {
    try {
      if (!serial_number || !password) {
        alert("Please enter both serial number and password.");
        return;
      }
      const response = await axios.post(
        "https://smartirrigate.vercel.app/api/auth/login",
        {
          serial_number,
          password,
        }
      );

      const { token } = response.data;

      // // Store the token in AsyncStorage for future use
      await AsyncStorage.setItem("token", token);

      console.log(token);

      if (token) {
        console.log("Login success:");
        navigation.navigate("Dashboard");
      } else {
        throw new Error("wrong credential");
      }
    } catch (error) {
      console.log("Login error:", error);
      alert("Login failed", "can't login");
    }

    // setSerialNumber("");
    setPassword("");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="user" size={24} color="green" />
        <Text style={styles.headerText}>Login</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Serial Number"
          value={serial_number}
          autoCompleteType="off"
          onChangeText={(text) => setSerialNumber(text)}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.otherContainer}>
          <TouchableOpacity style={styles.signupContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Create")}>
              <Text style={styles.registerButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Reset Account")}
            >
              <Text style={styles.forgotButtonText}>Forgot Password?</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#1ad766",
    height: 150,
    color: "#fff",
  },
  headerText: {
    fontSize: 18,
    marginLeft: 8,
    color: "#fff",
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  input: {
    height: 55,
    borderColor: "#d2d2d2",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  loginButton: {
    backgroundColor: "#1ad766",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  navigationText: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },

  otherContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginHorizontal: 10,
    marginVertical: 12,
    marginTop: 16,
  },
  registerButtonText: {
    color: "#1ad766",
    fontSize: 13,
  },
  forgotContainer: {
    width: "40%",
    height: 50,
    marginRight: 0,
  },
  forgotButtonText: {
    color: "#1ad766",
    fontSize: 13,
  },
});

export default LoginScreen;
