import { parse } from 'acorn'

// Preserve the original helpers, rendering functions and active deck verbatim.
// Remove the other course decks from the shared source before unlicensed delivery.
export function projectPythonPreview(source, deck) {
  const ast = parse(source, { ecmaVersion: 'latest', sourceType: 'script' })
  const declarations = []
  const assignments = []
  function walk(node) {
    if (!node || typeof node !== 'object') return
    if (node.type === 'VariableDeclarator' && ['DECKS', 'ORDER'].includes(node.id?.name)) declarations.push(node)
    if (node.type === 'ExpressionStatement' && node.expression?.type === 'AssignmentExpression' && node.expression.left?.type === 'MemberExpression' && node.expression.left.object?.name === 'DECKS') assignments.push(node)
    for (const value of Object.values(node)) if (Array.isArray(value)) value.forEach(walk); else if (value && typeof value === 'object') walk(value)
  }
  walk(ast)
  const decks = declarations.filter(node => node.id.name === 'DECKS')
  const order = declarations.filter(node => node.id.name === 'ORDER')
  if (decks.length !== 1 || order.length !== 1 || decks[0].init.type !== 'ObjectExpression' || order[0].init.type !== 'ArrayExpression') throw Error('Preview source changed; review the shared deck adapter.')
  const selected = decks[0].init.properties.find(property => (property.key.name || property.key.value) === deck)
  const assigned = assignments.some(statement => { const member = statement.expression.left; return (member.computed ? member.property.value : member.property.name) === deck })
  if ((!selected || selected.type !== 'Property') && !assigned) throw Error('Preview deck is unavailable.')
  const edits = [{ start: decks[0].init.start, end: decks[0].init.end, value: selected ? '{' + source.slice(selected.start, selected.end) + '}' : '{}' }, { start: order[0].init.start, end: order[0].init.end, value: JSON.stringify([deck]) }]
  // The original script also replaces several decks after the initial declaration.
  // Preserve an approved deck's replacement, but never ship the other paid decks.
  for (const statement of assignments) {
    const member = statement.expression.left
    const name = member.computed ? member.property.value : member.property.name
    if (typeof name !== 'string') throw Error('Preview deck assignment changed; review the adapter.')
    if (name !== deck) edits.push({ start: statement.start, end: statement.end, value: '' })
  }
  for (const edit of edits.sort((a, b) => b.start - a.start)) source = source.slice(0, edit.start) + edit.value + source.slice(edit.end)
  return source
}
