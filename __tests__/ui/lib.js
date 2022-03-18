exports.shouldMatchOuterHTMLSnapshot = async (selector) => {
    // Find element
    const elementHandle = await page.$(selector);
  
    // Get outer HTML
    const jsHandle = await elementHandle.getProperty('outerHTML');
  
    // To JSON
    const json = await jsHandle.jsonValue();
  
    // Test it
    expect(json).toMatchSnapshot()
  }