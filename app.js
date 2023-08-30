const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 33187;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
