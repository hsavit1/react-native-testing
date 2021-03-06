import React from 'react';
import { renderPage, getMockApiResponse } from '../../../utils/tests/helpers';
import { Movies } from '../Movies';
import { waitForElement } from 'react-native-testing-library';
import fetchMock from 'fetch-mock';
import { MOVIES_API_ENDPOINT } from '../../../api/config';
import { mockPopularMovies } from '../../../utils/tests/mockData/mockMovies';

describe('[Page] Movies', () => {
  beforeEach(() => {
    jest.useRealTimers();
    fetchMock.reset();
  });

  const mockGetMovies = () => {
    fetchMock.get(MOVIES_API_ENDPOINT, getMockApiResponse(200, { results: mockPopularMovies }));
  };

  it('should load movies and display movies properly [using jest timers]', () => {
    // SETUP
    jest.useFakeTimers();
    // we use fake timers to skip the 2 seconds of delay during the API call
    // thus we don't need to use async / await in this test
    mockGetMovies();
    // GIVEN the page renders
    const page = renderPage(<Movies />);
    // THEN it loads
    const Loader = page.queryByTestId('loader');
    expect(Loader).toBeTruthy();
    jest.runOnlyPendingTimers(); // don't run all timers here because delay (the redux saga effect) use recursive timers
    // THEN it shows the movies from the external API
    const FirstMovie = waitForElement(() => page.queryByText(mockPopularMovies[0].title));
    const SecondMovie = waitForElement(() => page.queryByText(mockPopularMovies[1].title));
    expect(FirstMovie).toBeTruthy();
    expect(SecondMovie).toBeTruthy();
  });
});
