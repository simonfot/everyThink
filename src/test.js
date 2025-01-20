// Simple test function to check if the frontend is working
export function testFrontend() {
    const tests = {
        // Test avatar center exists
        avatarExists: () => {
            const avatar = document.getElementById('avatar-center');
            console.assert(avatar !== null, 'Avatar center element exists');
            return avatar !== null;
        },

        // Test orbs exist
        orbsExist: () => {
            const orbs = document.querySelectorAll('.orb');
            console.assert(orbs.length > 0, 'Orb elements exist');
            return orbs.length > 0;
        },

        // Test coin counter exists
        coinCounterExists: () => {
            const coinCounter = document.getElementById('coinValue');
            console.assert(coinCounter !== null, 'Coin counter element exists');
            return coinCounter !== null;
        }
    };

    // Run all tests
    const results = Object.entries(tests).map(([name, test]) => {
        const passed = test();
        console.log(`Test ${name}: ${passed ? 'PASSED' : 'FAILED'}`);
        return passed;
    });

    // Log overall result
    const allPassed = results.every(r => r);
    console.log(`\nOverall test result: ${allPassed ? 'PASSED' : 'FAILED'}`);
    return allPassed;
}
