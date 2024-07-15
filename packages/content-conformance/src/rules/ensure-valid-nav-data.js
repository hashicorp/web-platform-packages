/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

function visitor(navNodes, report, depth = 0) {
  //  In order to be a valid branch, there needs to be at least one navNode.
  if (navNodes.length === 0) {
    report(
      `Found empty array of navNodes at depth ${depth}. There must be more than one route.`
    )
  }

  // Augment each navNode with its path __stack
  const navNodesWithStacks = navNodes.map((navNode) => {
    // Handle leaf nodes - split their paths into a __stack
    if (typeof navNode.path !== 'undefined') {
      if (!navNode.title) {
        report(
          `Missing nav-data title. Please add a non-empty title to the node with the path "${navNode.path}".`
        )
      }
      return { ...navNode, __stack: navNode.path.split('/') }
    }
    // Handle branch nodes - we recurse depth-first here
    if (navNode.routes) {
      const nodeWithStacks = handleBranchNode(navNode, report, depth)
      if (!navNode.title) {
        const branchPath = nodeWithStacks.__stack.join('/')
        report(
          `Missing nav-data title on NavBranch. Please add a title to the node with the inferred path "${branchPath}".`
        )
      }
      return nodeWithStacks
    }
    // Handle direct link nodes, identifiable
    // by the presence of an href, to ensure they have a title
    if (typeof navNode.href !== 'undefined') {
      if (navNode.href == '') {
        report(
          `Empty href value on NavDirectLink. href values must be non-empty strings. Node: ${JSON.stringify(
            navNode
          )}.`
        )
      }
      if (!navNode.title) {
        report(
          `Missing nav-data title on NavDirectLink. Please add a title to the node with href "${navNode.href}".`
        )
      }
      // Otherwise, we have a valid direct link node, we return it
      return navNode
    }
    // Ensure the only other node type is
    // a divider node, if not, throw an error
    if (!(navNode.divider || navNode.heading)) {
      report(
        `Unrecognized nav-data node. Please ensure all nav-data nodes are either NavLeaf, NavBranch, NavDirectLink, NavHeading, or NavDivider types. Invalid node: ${JSON.stringify(
          navNode
        )}.`
      )
    }
    // Other nodes, really just divider nodes,
    // aren't relevant, so we don't touch them
    return navNode
  })
  // Gather all the path stacks at this level
  const routeStacks = navNodesWithStacks.reduce((acc, navNode) => {
    // Ignore nodes that don't have a path stack
    if (!navNode.__stack) return acc
    // For other nodes, add their stacks
    return acc.concat([navNode.__stack])
  }, [])
  // Ensure that there are no duplicate routes
  // (for example, a nested route with a particular path,
  // and a named page at the same level with the same path)
  const routePaths = routeStacks.map((s) => s.join('/'))
  const duplicateRoutes = routePaths.filter((value, index, self) => {
    return self.indexOf(value) !== index
  })
  if (duplicateRoutes.length > 0) {
    report(
      `Duplicate routes found for "${duplicateRoutes[0]}". Please resolve duplicates.`
    )
  }
  // Gather an array of all resolved paths at this level
  const parentRoutes = routeStacks.map((stack) => {
    // Index leaf nodes will have the same
    // number of path parts as the current nesting depth.
    const isIndexNode = stack.length === depth
    if (isIndexNode) {
      // The "dirPath" for index nodes is
      // just the original path
      return stack.join('/')
    }
    // Named leaf nodes, and nested routes,
    // will have one more path part than the current nesting depth.
    const isNamedNode = stack.length === depth + 1
    if (isNamedNode) {
      // The "dirPath" for named nodes is
      // the original path with the last part dropped.
      return stack.slice(0, stack.length - 1).join('/')
    }
    // If we have any other number of parts in the
    // leaf node's path, then it is invalid.
    report(
      `Invalid path depth. At depth ${depth}, found path "${stack.join(
        '/'
      )}". Please move this path to the correct depth of ${stack.length - 1}.`
    )
  })
  // We expect all routes at any level to share the same parent directory.
  // In other words, we expect there to be exactly one unique "dirPath"
  // shared across all the routes at this level.
  const uniqueParents = parentRoutes.filter((value, index, self) => {
    return self.indexOf(value) === index
  })
  // We throw an error if we find mismatched paths
  // that don't share the same parent path.
  if (uniqueParents.length > 1) {
    report(
      `Found mismatched paths at depth ${depth}, with paths: ${JSON.stringify(
        routePaths
      )}. Implies mismatched parent directories: ${JSON.stringify(
        uniqueParents
      )}.`
    )
  }

  // Note: some branches may not have any children with paths,
  // for example branches with only direct links. So, path may be undefined.
  const path = uniqueParents[0]
  //  Finally, we return
  return [path, navNodesWithStacks]
}

function handleBranchNode(navNode, report, depth) {
  // We recurse depth-first here, and we'll throw an error
  // if any nested routes have structural issues
  const [path, routesWithStacks] = visitor(navNode.routes, report, depth + 1)
  // Path will be undefined if the child routes are
  // only non-path nodes (such as direct links).
  // In this case, we set __stack to false so this route
  // is left out of tree structure validation
  const __stack = !path ? false : path.split('/')
  return { ...navNode, __stack, routes: routesWithStacks }
}

/** @type {import('../types.js').ConformanceRuleBase} */
export default {
  id: 'ensure-valid-nav-data',
  type: 'data',
  description: 'Ensures docs nav data files are properly formatted.',
  executor: {
    dataFile(file, context) {
      // by convention, nav data files are those that end in nav-data.json
      if (!file.basename.endsWith('nav-data.json')) {
        return
      }

      const report = (message) => context.report(message, file)

      visitor(file.contents(), report)
    },
  },
}
