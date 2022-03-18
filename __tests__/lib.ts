const r1 = require("r1scraper")

const districtId = "85186918-5A19-4676-A654-3F3AC054DD77"

expect.extend({
    arrayContainsObject(received, argument: Object[]) {
        const pass = this.equals(received,
            expect.arrayContaining([
                    expect.objectContaining(argument)
            ])
        )
    
        if (pass) {
            return {
                message: () => (`expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(argument)}`),
                pass: true
            }
        } else {
            return {
                message: () => (`expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`),
                pass: false
            }
        }
    }
})

declare global {
    namespace jest {
        interface Matchers<R> {
            arrayContainsObject(argument: Object):  CustomMatcherResult;
        }
    }
}

export {
    districtId,
    r1
}