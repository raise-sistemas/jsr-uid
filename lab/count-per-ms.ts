let lastTs = 0
let maxCount = 0
let count = 0
while (true) {
  const now = Date.now()
  if (now === lastTs) {
    count++
  } else {
    lastTs = now
    if (count > maxCount) {
      maxCount = count
      console.log(maxCount)
    }
    count = 0
  }

}
