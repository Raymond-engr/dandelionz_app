import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: mockBack, push: vi.fn() }),
}));

vi.mock('@/components/AppLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/LoadingSpinner', () => ({
  default: () => <div>loading</div>,
}));

const mockUnwrap = vi.fn();
const mockInitialize = vi.fn(() => ({ unwrap: mockUnwrap }));
vi.mock('@/lib/api/customerApi', () => ({
  useInitializeWalletDepositMutation: () => [mockInitialize, { isLoading: false }],
}));

import WalletDepositPage from './page';

const submitButton = () => screen.getByRole('button', { name: /continue to payment/i });
const amountInput = () => screen.getByLabelText(/amount to add/i);

describe('Wallet deposit page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUnwrap.mockResolvedValue({
      success: true,
      data: {
        reference: 'DEP-123',
        amount: 1000,
        authorization_url: 'https://checkout.paystack.com/abc',
      },
    });
  });

  it('keeps the submit button disabled until the amount is within the server bounds', () => {
    render(<WalletDepositPage />);

    // Empty field.
    expect(submitButton()).toBeDisabled();

    // Below the ₦100 minimum.
    fireEvent.change(amountInput(), { target: { value: '99' } });
    expect(submitButton()).toBeDisabled();
    expect(screen.getByText(/minimum top-up is ₦100/i)).toBeInTheDocument();

    // Above the ₦500,000 maximum.
    fireEvent.change(amountInput(), { target: { value: '500001' } });
    expect(submitButton()).toBeDisabled();
    expect(screen.getByText(/maximum top-up is ₦500,000/i)).toBeInTheDocument();

    // A valid amount enables it.
    fireEvent.change(amountInput(), { target: { value: '1000' } });
    expect(submitButton()).not.toBeDisabled();
  });

  it('enables submit at exactly the minimum', () => {
    render(<WalletDepositPage />);

    fireEvent.change(amountInput(), { target: { value: '100' } });
    expect(submitButton()).not.toBeDisabled();
  });

  it('fills the amount from a quick-pick button and enables submit', () => {
    render(<WalletDepositPage />);

    fireEvent.click(screen.getByRole('button', { name: '₦5,000' }));

    expect((amountInput() as HTMLInputElement).value).toBe('5000');
    expect(submitButton()).not.toBeDisabled();
  });

  it('tells the customer that top-ups cannot be withdrawn', () => {
    render(<WalletDepositPage />);

    expect(screen.getByText(/cannot be withdrawn to a bank account/i)).toBeInTheDocument();
  });

  it('does not call the API for an invalid amount', () => {
    render(<WalletDepositPage />);

    fireEvent.change(amountInput(), { target: { value: '10' } });
    fireEvent.submit(amountInput().closest('form') as HTMLFormElement);

    expect(mockInitialize).not.toHaveBeenCalled();
  });
});
