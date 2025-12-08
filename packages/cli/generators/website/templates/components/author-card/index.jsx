/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import fragment from './fragment.graphql'
import Image from '@hashicorp/react-image'

function AuthorCard({ data }) {
  return <p>{JSON.stringify(data)}</p>
}

AuthorCard.fragmentSpec = { fragment, dependencies: [Image] }

export default AuthorCard
