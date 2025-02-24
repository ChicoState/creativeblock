import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";



export default function MyForm() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to CreativeBlock</Text>
        <Button title="Start" onPress={() => console.log("Start Pressed")} />
        <br />
        <label>
          New Idea!!! <br />
          <input name="new_idea" />
        </label>
        {/* <button type="reset">Reset form</button> */}
        <br />
        <button type="submit">Submit form</button>
      </View>
    </form>
  );
}




// export default function Index() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to CreativeBlock</Text>
//       <Button title="Start" onPress={() => console.log("Start Pressed")} />
//       <label>
//         New Idea!!!
//         <input name="new_idea" />
//       </label>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
