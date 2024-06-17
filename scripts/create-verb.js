module.exports = {
    newVerbFile: async (tp) => {
      const fileName = await tp.system.prompt("Enter verb name:");
      const folderPath = "./words/Verbs";
      const fullPath = `${folderPath}/${fileName}.md`;
  
      await tp.file.create_new(tp.file.find_tfile("./Templates/Verb.md"), fullPath, false);
    }
  }