module.exports = async (model, field, value) => {
  console.log(model, field, value);
  try {
    const documentsToUpdate = await model.find({ field: { $exists: false } });
    console.log(documentsToUpdate);

    for (const document of documentsToUpdate) {
      document[field] = value;
      document.save();
    }
    console.log(`Updated ${documentsToUpdate.length} documents`);
  } catch (error) {
    console.log(error);
  }
};
