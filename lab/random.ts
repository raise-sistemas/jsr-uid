/**
 * Analysis: Why Math.random() is Discouraged for Cryptographic/Security Applications
 *
 * This demonstrates the differences between Math.random() and cryptographically secure
 * random number generators, and why it matters for unique identifiers.
 */

console.log('=== Math.random() vs Cryptographically Secure Random ===\n');

/**
 * Test Math.random() predictability and quality
 */
function analyzeMathRandom() {
    console.log('1. PREDICTABILITY ISSUES:\n');

    console.log('Math.random() uses Pseudorandom Number Generator (PRNG):');
    console.log('- Deterministic algorithm with internal seed state');
    console.log('- Same seed → same sequence of "random" numbers');
    console.log('- Can be predicted if you know the algorithm and current state\n');

    // Demonstrate Math.random() patterns
    console.log('Math.random() sample sequence:');
    Math.seedrandom && Math.seedrandom(12345); // If seedrandom library available

    const mathRandomSamples = [];
    for (let i = 0; i < 10; i++) {
        mathRandomSamples.push(Math.random());
    }

    mathRandomSamples.forEach((val, i) => {
        console.log(`${String(i + 1).padStart(2)}: ${val.toFixed(10)}`);
    });

    console.log('\n2. SECURITY IMPLICATIONS:\n');
    console.log('❌ Math.random() vulnerabilities:');
    console.log('- Attackers can predict future values');
    console.log('- Vulnerable to timing attacks');
    console.log('- Not suitable for passwords, tokens, or security keys');
    console.log('- May have detectable patterns or bias');
    console.log('- Implementation varies by JavaScript engine\n');
}

/**
 * Demonstrate cryptographically secure alternatives
 */
function demonstrateCryptoRandom() {
    console.log('3. CRYPTOGRAPHICALLY SECURE ALTERNATIVES:\n');

    console.log('✅ crypto.getRandomValues() (Browser):');
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const secureArray = new Uint32Array(5);
        crypto.getRandomValues(secureArray);

        console.log('- Uses OS-level entropy sources');
        console.log('- Hardware random number generators');
        console.log('- Unpredictable even with knowledge of previous values');
        console.log('- Cryptographically strong');
        console.log('\nSecure random samples:');

        secureArray.forEach((val, i) => {
            console.log(`${String(i + 1).padStart(2)}: ${val} (0x${val.toString(16).padStart(8, '0').toUpperCase()})`);
        });
    } else {
        console.log('crypto.getRandomValues() not available in this environment');
    }

    console.log('\n✅ crypto.randomBytes() (Node.js):');
    console.log('- Uses /dev/urandom on Unix systems');
    console.log('- CryptGenRandom on Windows');
    console.log('- Entropy from system events, hardware, etc.');
    console.log('- Suitable for cryptographic applications\n');
}

/**
 * Compare randomness quality
 */
function compareRandomQuality() {
    console.log('4. QUALITY COMPARISON:\n');

    const sampleSize = 10000;

    // Math.random() distribution test
    console.log(`Testing distribution with ${sampleSize.toLocaleString()} samples:\n`);

    const mathRandomBuckets = new Array(10).fill(0);
    const cryptoBuckets = new Array(10).fill(0);

    // Math.random() samples
    for (let i = 0; i < sampleSize; i++) {
        const bucket = Math.floor(Math.random() * 10);
        mathRandomBuckets[bucket]++;
    }

    // Crypto random samples (if available)
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        for (let i = 0; i < sampleSize; i++) {
            const arr = new Uint32Array(1);
            crypto.getRandomValues(arr);
            const bucket = Math.floor((arr[0] / 0xFFFFFFFF) * 10);
            cryptoBuckets[bucket]++;
        }
    }

    console.log('Distribution across 10 buckets (should be ~1000 each):');
    console.log('\nMath.random():');
    mathRandomBuckets.forEach((count, i) => {
        const bar = '█'.repeat(Math.round(count / 50));
        console.log(`Bucket ${i}: ${String(count).padStart(4)} ${bar}`);
    });

    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        console.log('\ncrypto.getRandomValues():');
        cryptoBuckets.forEach((count, i) => {
            const bar = '█'.repeat(Math.round(count / 50));
            console.log(`Bucket ${i}: ${String(count).padStart(4)} ${bar}`);
        });
    }

    // Calculate chi-square test for uniformity
    const expected = sampleSize / 10;
    let mathRandomChiSquare = 0;
    let cryptoChiSquare = 0;

    mathRandomBuckets.forEach(observed => {
        mathRandomChiSquare += Math.pow(observed - expected, 2) / expected;
    });

    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        cryptoBuckets.forEach(observed => {
            cryptoChiSquare += Math.pow(observed - expected, 2) / expected;
        });
    }

    console.log(`\nChi-square test (lower = more uniform):`);
    console.log(`Math.random(): ${mathRandomChiSquare.toFixed(4)}`);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        console.log(`crypto.getRandomValues(): ${cryptoChiSquare.toFixed(4)}`);
    }
}

/**
 * Demonstrate collision risks with Math.random()
 */
function demonstrateCollisionRisk() {
    console.log('\n5. COLLISION RISK ANALYSIS:\n');

    console.log('Math.random() collision scenarios:\n');

    // Test for birthday paradox with Math.random()
    function testCollisions(generator, name, samples = 10000) {
        const seen = new Set();
        let collisions = 0;

        for (let i = 0; i < samples; i++) {
            const value = Math.floor(generator() * 1000000); // Scale to integer
            if (seen.has(value)) {
                collisions++;
            }
            seen.add(value);
        }

        const collisionRate = (collisions / samples * 100).toFixed(4);
        console.log(`${name}:`);
        console.log(`- Generated: ${samples.toLocaleString()} values`);
        console.log(`- Unique values: ${seen.size.toLocaleString()}`);
        console.log(`- Collisions: ${collisions}`);
        console.log(`- Collision rate: ${collisionRate}%\n`);
    }

    // Test Math.random()
    testCollisions(() => Math.random(), 'Math.random() (scaled to 1M range)');

    // Test crypto random if available
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        testCollisions(() => {
            const arr = new Uint32Array(1);
            crypto.getRandomValues(arr);
            return arr[0] / 0xFFFFFFFF;
        }, 'crypto.getRandomValues() (scaled to 1M range)');
    }
}

/**
 * Show when Math.random() IS appropriate
 */
function whenMathRandomIsOK() {
    console.log('6. WHEN Math.random() IS ACCEPTABLE:\n');

    console.log('✅ Math.random() is fine for:');
    console.log('- Games and simulations');
    console.log('- Visual effects and animations');
    console.log('- Non-security random sampling');
    console.log('- Performance testing with deterministic results');
    console.log('- Educational examples');
    console.log('- Procedural generation (art, music, levels)');
    console.log('- A/B testing randomization (non-security)');

    console.log('\n❌ Math.random() should NOT be used for:');
    console.log('- Unique identifiers (UUIDs, ULIDs, session IDs)');
    console.log('- Password generation');
    console.log('- Cryptographic keys or nonces');
    console.log('- Security tokens');
    console.log('- CSRF protection');
    console.log('- Random salts for hashing');
    console.log('- Any security-sensitive application');

    console.log('\n📚 Example - Acceptable Math.random() use:');
    console.log('```javascript');
    console.log('// ✅ OK: Game particle effects');
    console.log('particles.forEach(p => {');
    console.log('  p.x += (Math.random() - 0.5) * 2; // Random drift');
    console.log('  p.color = `hsl(${Math.random() * 360}, 50%, 50%)`;');
    console.log('});');
    console.log('');
    console.log('// ❌ BAD: Session ID generation');
    console.log('const sessionId = Math.random().toString(36); // Predictable!');
    console.log('```');
}

/**
 * Demonstrate ULID-specific concerns
 */
function ulidSpecificConcerns() {
    console.log('\n7. ULID-SPECIFIC CONCERNS:\n');

    console.log('Why Math.random() is especially problematic for ULIDs:');

    console.log('\n🔐 Security Issues:');
    console.log('- ULIDs often used as database primary keys');
    console.log('- Predictable ULIDs = enumerable records');
    console.log('- Information disclosure vulnerabilities');
    console.log('- Timing attacks possible');

    console.log('\n📊 Quality Issues:');
    console.log('- Lower entropy than crypto.getRandomValues()');
    console.log('- Potential bias in random bits');
    console.log('- Engine-specific implementation differences');
    console.log('- May not pass statistical randomness tests');

    console.log('\n🔄 Collision Issues:');
    console.log('- Higher collision probability than necessary');
    console.log('- Reduced effective random space');
    console.log('- Less uniform distribution');

    console.log('\n✅ ULID Best Practices:');
    console.log('1. Use crypto.getRandomValues() in browsers');
    console.log('2. Use crypto.randomBytes() in Node.js');
    console.log('3. Fall back to Math.random() only when crypto unavailable');
    console.log('4. Add warnings when using Math.random() fallback');
    console.log('5. Consider using monotonic sequence for same-instance generation');
}

/**
 * Performance comparison
 */
function performanceComparison() {
    console.log('\n8. PERFORMANCE COMPARISON:\n');

    const iterations = 100000;

    // Math.random() performance
    const mathRandomStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        Math.random();
    }
    const mathRandomTime = performance.now() - mathRandomStart;

    // Crypto performance (if available)
    let cryptoTime = 'N/A';
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const cryptoStart = performance.now();
        for (let i = 0; i < iterations; i++) {
            const arr = new Uint32Array(1);
            crypto.getRandomValues(arr);
        }
        cryptoTime = performance.now() - cryptoStart;
    }

    console.log(`Performance test (${iterations.toLocaleString()} iterations):`);
    console.log(`Math.random(): ${mathRandomTime.toFixed(2)}ms`);
    console.log(`crypto.getRandomValues(): ${typeof cryptoTime === 'number' ? cryptoTime.toFixed(2) + 'ms' : cryptoTime}`);

    if (typeof cryptoTime === 'number') {
        const ratio = (cryptoTime / mathRandomTime).toFixed(2);
        console.log(`Crypto is ${ratio}x slower than Math.random()`);
        console.log('But the security benefit far outweighs the performance cost!');
    }
}

// Run all analyses
analyzeMathRandom();
demonstrateCryptoRandom();
compareRandomQuality();
demonstrateCollisionRisk();
whenMathRandomIsOK();
ulidSpecificConcerns();
performanceComparison();

console.log('\n=== SUMMARY ===');
console.log('Math.random() is discouraged for ULIDs because:');
console.log('1. 🔒 Security: Predictable and vulnerable to attacks');
console.log('2. 📊 Quality: Lower entropy and potential bias');
console.log('3. 🔄 Collisions: Higher collision probability');
console.log('4. 🌐 Consistency: Implementation varies by engine');
console.log('5. 📈 Standards: Crypto standards require secure randomness');
console.log('\nAlways use crypto.getRandomValues() or crypto.randomBytes() for ULIDs!');

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        analyzeMathRandom,
        demonstrateCryptoRandom,
        compareRandomQuality,
        demonstrateCollisionRisk
    };
}
