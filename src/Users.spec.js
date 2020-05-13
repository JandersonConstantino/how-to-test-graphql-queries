import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'

import Users, { query } from './Users'

describe('Tests Users', () => {
  it('should render loading text when fetching', () => {
    const { queryAllByText } = renderComponents();

    const countLoading = queryAllByText('is loading...')
    expect(countLoading).toHaveLength(1)
  })

  it('should render results of query', async () => {
    const { getByTestId } = renderComponents();

    await waitFor(() => {
      const tableItem = getByTestId('table-user-tr-1')
      const children = tableItem.querySelectorAll('td')

      expect(children[0].innerHTML).toEqual('1')
      expect(children[1].innerHTML).toEqual('Michael Douglas')
    })
  })

  it('should filter results using input filter', async () => {
    const event = { target: { value: 'Julia' } }

    const { getByTestId } = renderComponents();

    const input = getByTestId('input-filter-id')
    fireEvent.change(input, event)

    await waitFor(() => {
      let tableItem
      let children

      tableItem = getByTestId('table-user-tr-2')
      children = tableItem.querySelectorAll('td')

      expect(children[0].innerHTML).toEqual('2')
      expect(children[1].innerHTML).toEqual('Julia Roberts')

      tableItem = getByTestId('table-user-tr-3')
      children = tableItem.querySelectorAll('td')

      expect(children[0].innerHTML).toEqual('3')
      expect(children[1].innerHTML).toEqual('Julia Stiles')
    })
  })

  it('should NOT should table when request not return items', async () => {
    const event = { target: { value: 'zzz' } }

    const { getByTestId, queryAllByTestId } = renderComponents();

    const input = getByTestId('input-filter-id')
    fireEvent.change(input, event)

    await waitFor(() => {
      expect(queryAllByTestId('table-user')).toHaveLength(0)
    })
  })
})

const defaultMocks = [
  {
    request: {
      query,
      variables: { description: '' }
    },
    result: {
      data: {
        users: {
          items: [
            { id: 1, name: 'Michael Douglas' }
          ]
        }
      }
    }
  },
  {
    request: {
      query,
      variables: { description: 'Julia' }
    },
    result: {
      data: {
        users: {
          items: [
            { id: 2, name: 'Julia Roberts' },
            { id: 3, name: 'Julia Stiles' }
          ]
        }
      }
    }
  },
  {
    request: {
      query,
      variables: { description: 'zzz' }
    },
    result: {
      data: { users: { items: [] } }
    }
  }
]

const renderComponents = (mocks = defaultMocks) => {
  return render(
    <MockedProvider addTypename={false} mocks={mocks}>
      <Users />
    </MockedProvider>
  )
}
