import { uid } from ".."

console.log(BigInt(uid()).toString(36).toUpperCase())

let lastId = 0n
let count = 0
let maxCount = 0
while(true) {
  const id = uid()
  const bid = BigInt(id)
  if (bid - lastId === 1n) {
    count++
    const b = bid.toString(2)
    const join = b.substring(0, 37) + "|" + b.substring(37, 37 + 4) + "|" + b.substring(37 + 4, 37 + 4 + 11) + "|" + b.substring(37 + 4 + 11)
    if (count > maxCount) console.log(count, id, join)
    maxCount = Math.max(maxCount, count)
  } else {
    count = 0
  }
  lastId = bid
}
