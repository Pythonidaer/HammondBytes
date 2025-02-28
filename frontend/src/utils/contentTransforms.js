/**
 * Preprocesses content blocks from Strapi to handle special cases like consecutive code blocks.
 * 
 * This function performs the following operations:
 * 1. Identifies consecutive paragraph blocks that contain only code (marked with code: true)
 * 2. Combines these consecutive code blocks into a single 'code-fence' block
 * 3. Preserves the line breaks between code lines by joining them with '\n'
 * 4. Maintains all other block types (headings, regular paragraphs, lists) as they are
 * 
 * The function specifically looks for blocks where:
 * - type is 'paragraph'
 * - has exactly one child
 * - the child is of type 'text'
 * - the child has code: true
 * 
 * When such blocks are found consecutively, they are merged into a single block with:
 * - type: 'code-fence' (custom type for multi-line code)
 * - children: single text node containing all code lines joined by newlines
 * 
 * @param {Array} blocks - Array of content blocks from Strapi
 * @returns {Array} - Processed blocks with consecutive code blocks combined
 */
export function preprocessBlocks(blocks) {
  if (!Array.isArray(blocks)) return [];

  let newBlocks = [];
  let codeBuffer = [];

  const isCodeBlock = (block) => {
    return block.type === 'paragraph' && 
           block.children?.length === 1 && 
           block.children[0].type === 'text' && 
           block.children[0].code === true;
  };

  blocks.forEach((block, index) => {
    if (isCodeBlock(block)) {
      // Add the code content to our buffer
      codeBuffer.push(block.children[0].text);
    } else {
      // If we have buffered code blocks, create a code block
      if (codeBuffer.length > 0) {
        newBlocks.push({
          type: 'code-fence',  // Custom type for multi-line code
          children: [{
            type: 'text',
            text: codeBuffer.join('\n')
          }]
        });
        codeBuffer = [];
      }
      // Add the non-code block as is
      newBlocks.push(block);
    }
  });

  // Don't forget any remaining code blocks
  if (codeBuffer.length > 0) {
    newBlocks.push({
      type: 'code-fence',  // Custom type for multi-line code
      children: [{
        type: 'text',
        text: codeBuffer.join('\n')
      }]
    });
  }

  // Remove any empty paragraphs at the end
  return newBlocks.filter(block => {
    if (block.type === 'paragraph' && 
        block.children?.length === 1 && 
        block.children[0].type === 'text' && 
        block.children[0].text === '') {
      return false;
    }
    return true;
  });
}
