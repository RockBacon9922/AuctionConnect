// TypeScript
const jsonString =
  '{"auction":"{\\"setup\\":true,\\"started\\":false,\\"paused\\":false,\\"date\\":\\"2023-11-05\\",\\"name\\":\\"sfff\\",\\"currentLotId\\":\\"0\\",\\"lots\\":[]}","platform":"[{\\"name\\":\\"stoneham\\",\\"primary\\":true,\\"status\\":\\"inactive\\"},{\\"name\\":\\"easyliveAuction\\",\\"primary\\":false,\\"status\\":\\"inactive\\"},{\\"name\\":\\"theSaleroom\\",\\"primary\\":false,\\"status\\":\\"inactive\\"}]","_persist":"{\\"version\\":1,\\"rehydrated\\":true}"}';
// Parse the JSON string
const jsonObject = JSON.parse(jsonString);

console.log(jsonObject);
