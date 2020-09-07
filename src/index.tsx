import 'codemirror/lib/codemirror.css'
import './styles/codemirror-theme.css'
import './styles/reset.css'
import './styles/index.css'

import React from 'react'
import ReactDOM from 'react-dom'

import { getHashString, buildHashString } from './utils/HashString'
import { prefixAndApply } from './utils/Styles'
import { appendCSS } from './utils/CSS'
import { normalize, InternalOptions, PublicOptions } from './utils/options'
import App from './components/workspace/App'

const { data = '{}' } = getHashString()

const publicOptions: PublicOptions = JSON.parse(data)

const { css, ...rest }: InternalOptions = normalize(publicOptions)

if (css) {
  appendCSS(css)
}

const mount = document.getElementById('react-root') as HTMLDivElement

// Set mount node to flex in a vendor-prefixed way
prefixAndApply({ display: 'flex' }, mount)

ReactDOM.render(<App onChange={onChange} {...rest} />, mount)

function onChange(files: Record<string, string>) {
  const hashString = buildHashString({
    data: JSON.stringify({
      ...publicOptions,
      ...(publicOptions.files
        ? { files }
        : { code: files[Object.keys(files)[0]] }),
    }),
  })

  try {
    history.replaceState({}, '', hashString)
  } catch (e) {
    // Browser doesn't support pushState
  }
}