const { execSync } = require("child_process");

// Get the current branch name
const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

// Output the branch name
console.log(branch);
