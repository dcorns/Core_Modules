import * as fs from "node:fs/promises";
import * as readline from "node:readline/promises";
if (process.argv[2] === "0") {
  const choice = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  choice.setPrompt("Which example would you like to run? (1-4, exit to quit) ");
  choice.prompt();

  choice.on("line", async (input) => {
    if (input === "exit") choice.close();
    switch (input) {
      case "1":
        await example1();
        break;
      case "2":
        await example2();
        break;
      case "3":
        await example3();
        break;
      case "4":
        await example4();
        break;
      default:
        console.log("No example selected");
        break;
    }
    choice.prompt();
  });

  choice.on("close", () => {
    console.log("Session Ended!");
    process.exit(0);
  });
}
//console.log(process.argv);
const removeFile = async (filePath) => {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    await fs.unlink(filePath);
  } catch (e) {
    console.log(`${filePath} does not exist`);
  }
};
//fileHandles
//Example 1
const example1 = async () => {
  console.log(
    `Example 1: Open File, appendFile(string), Close File, Emmit File closed message, Open File again, Create a readStream, Use Stream Commands to stream(close, push, read), Read file into buffer, Close File, Open file again and use readFile to read the file, Close File`
  );
  await removeFile("./myFile");
  let myFile = await fs.open("./myFile", "w");
  myFile.on("close", () => console.log("myFile closed"));
  if (myFile) {
    await myFile.appendFile("Hello World");
    await myFile.close();
  }

  myFile = await fs.open("./myFile", "r");
  if (myFile) {
    let myStream = myFile.createReadStream();
    setTimeout(() => {
      myStream.close();
      myStream.push(null);
      myStream.read(0);
    }, 100);
  }
  const { bytesRead, buffer } = await myFile.read();
  console.log(`bytesRead: ${bytesRead}, buffer: ${buffer.toString()}`);
  //readFile starts to read from the beginning or from the current position left by read so this first readFile comes up blank since the whole file was read by the read method
  const totalFile = await myFile.readFile({ encoding: "utf8" });
  console.log(totalFile);
  //By creating a new instance of the file the starting position gets reset and now readFile is able to read the whole file
  await myFile.close();

  myFile = await fs.open("./myFile", "r");
  const totalFileAfterReaopening = await myFile.readFile({ encoding: "utf8" });
  console.log(totalFileAfterReaopening);
  await myFile.close();
};

//Example 2
const example2 = async () => {
  console.log(
    `Example 2: Open File, append some lines, close file, open file, read a line at a time, close file, Open file, truncate file, Read file into buffer, close file`
  );
  await removeFile("./myFile");
  let myFile = await fs.open("./myFile", "a+");
  //note if await is not used here, the appended data will all be written, but not in the expected order
  await myFile.appendFile("Hello World1\n");
  await myFile.appendFile("Hello World2\n");
  await myFile.appendFile("Hello World3\n");
  await myFile.appendFile("Hello World4\n");
  await myFile.appendFile("Hello World5\n");
  await myFile.close();
  //If the file was not closed and reopened here the readLines method would not work, probably due to the previous flag of a+
  myFile = await fs.open("./myFile", "r");
  const fileStats = await myFile.stat();
  console.log(fileStats);
  for await (const line of myFile.readLines()) {
    console.log(line);
  }
  //redundant, closes after lines are all read, but better to be explicit
  await myFile.close();
  myFile = await fs.open("./myFile", "w+");
  await myFile.truncate(8);
  const { bytesRead, buffer } = await myFile.read();
  console.log(`bytesRead: ${bytesRead}, buffer: ${buffer}`);
  await myFile.close();
};

//Example 3
const example3 = async () => {
  console.log(
    `Example 3: open file, change meta dates, replace file text, close file`
  );
  removeFile("./myFile");
  let myFile = await fs.open("./myFile", "w+");
  await myFile.utimes(new Date(), new Date());
  myFile.on("close", () => console.log("myFile closed"));
  myFile.writeFile("Replacement text");
  myFile.close();
};

//Example 4
const example4 = async () => {
  console.log(
    `Example 4: Check file visibility and read, write, execute permissions.`
  );
  //await removeFile("./myFile");
  let fileName = "./myFile";

  const checkFileAccess = async (fileName, mode) => {
    const modeName =
      mode === 0
        ? "F_OK"
        : mode === 4
        ? "R_OK"
        : mode === 2
        ? "W_OK"
        : mode === 1
        ? "X_OK"
        : "Unknown";
    try {
      await fs.access(fileName, mode);
      const fileStats = await fs.stat(fileName);
      console.log(fileStats.mode);
      const permissions = parseInt(fileStats.mode.toString(8), 10);
      console.log(permissions);
      console.log(`${fileName} mode ${modeName} passed`);
    } catch (e) {
      console.error(`${fileName} ${modeName} failed`);
      //console.error(e);
    }
  };
  await checkFileAccess("./myFile", fs.constants.F_OK); //visible 0
  await checkFileAccess("./noFileHere", fs.constants.F_OK); //not visible 0
  await checkFileAccess("./myFile", fs.constants.R_OK); //readable 4
  await checkFileAccess("./myFile", fs.constants.W_OK); //writable 2
  await checkFileAccess("./myFile", fs.constants.X_OK); //executable 1
  try {
    let myFile = await fs.open("./myFile", "w");
    await myFile.chmod(0o444); //owner:r-- group:r-- everyone:r-- (windows only controls single user read/write)
    await myFile.close();
  } catch (e) {
    console.error(e);
    console.log(`deleting file so it can be recreated with write permissions`);
    await fs.unlink("./myFile");
  }
  await checkFileAccess("./myFile", fs.constants.R_OK);
  await checkFileAccess("./myFile", fs.constants.W_OK);
  await checkFileAccess("./myFile", fs.constants.X_OK);
  //myFile = await fs.open("./myFile", "w");
  //await myFile.chmod(0o777); //owner:rwx group:rwx everyone:rwx
  //await myFile.close();
};

switch (process.argv[2]) {
  case "1":
    example1();
    break;
  case "2":
    example2();
    break;
  case "3":
    example3();
    break;
  case "4":
    example4();
    break;
  default:
    console.log("No example selected");
    break;
}
