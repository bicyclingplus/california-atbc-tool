import { expect, test } from 'vitest';
import {
	_calc_air_quality_monetary,
	_calc_GHG_monetary,
} from './calcEmissionsMonetary.js';

// actual
test('air quality output matches R script 1', () => {

	const result = _calc_air_quality_monetary(
		2024,
		20,
		0.001749 * 1E6
	);

	expect(Math.round(result * 100) / 100).toBe(1251.89);
});

test('air quality output matches R script 2', () => {

	const result = _calc_air_quality_monetary(
		2026,
		20,
		0.001749 * 1E6
	);

	expect(Math.round(result * 100) / 100).toBe(1280.63);
});

// actual
test('GHG output matches R script 1', () => {

	const result = _calc_GHG_monetary(
		2026,
		20,
		383.58 * 1E6
	);

	expect(Math.round(result * 100) / 100).toBe(94623.59);
});

test('GHG output matches R script 2', () => {

	const result = _calc_GHG_monetary(
		2025,
		20,
		383.58 * 1E6
	);

	expect(Math.round(result * 100) / 100).toBe(92768.22);
});
