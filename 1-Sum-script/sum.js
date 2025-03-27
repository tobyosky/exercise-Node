function sum(...numbers) {
  const addends = [...numbers];
  const sum = addends.reduce((total, addend) => (total += addend), 0);
  console.log(`The sum of ${addends.join(" + ")} = ${sum}`);
}

sum(5, 6);
