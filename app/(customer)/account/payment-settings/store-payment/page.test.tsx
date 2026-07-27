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

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

const mockGetSettings = vi.fn();
vi.mock('@/lib/api/customerApi', () => ({
  useGetCustomerPaymentSettingsQuery: () => mockGetSettings(),
  useUpdateCustomerPaymentSettingsMutation: () => [
    vi.fn().mockReturnValue({ unwrap: () => Promise.resolve({ success: true }) }),
    { isLoading: false },
  ],
}));

const mockVerify = vi.fn();
vi.mock('@/lib/api/vendorApi', () => ({
  useGetBanksQuery: () => ({
    data: {
      success: true,
      data: [
        { name: 'Access Bank', code: '044', active: true },
        { name: 'GTBank', code: '058', active: true },
      ],
    },
    isLoading: false,
  }),
  useVerifyBankAccountMutation: () => [mockVerify, { isLoading: false }],
}));

import CustomerPayoutDetailsPage from './page';

const saveButton = () => screen.getByRole('button', { name: /save changes/i });
const verifyButton = () => screen.getByRole('button', { name: /^verify$/i });

describe('Customer payout details page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSettings.mockReturnValue({ data: undefined, isLoading: false });
    mockVerify.mockReturnValue({
      unwrap: () =>
        Promise.resolve({ success: true, data: { account_name: 'JANE DOE' } }),
    });
  });

  it('disables Save until the account has been verified', async () => {
    render(<CustomerPayoutDetailsPage />);

    expect(saveButton()).toBeDisabled();

    // Selecting a bank alone is not enough.
    fireEvent.click(screen.getByRole('button', { name: /select bank/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Access Bank' }));
    expect(saveButton()).toBeDisabled();

    // Nor is typing a full account number.
    const input = screen.getByPlaceholderText('10-digit Account Number');
    fireEvent.change(input, { target: { value: '0123456789' } });
    expect(saveButton()).toBeDisabled();

    // Only a successful verification enables it.
    fireEvent.click(verifyButton());
    expect(await screen.findByText('JANE DOE')).toBeInTheDocument();
    expect(saveButton()).not.toBeDisabled();
  });

  it('re-disables Save when the account number is edited after verifying', async () => {
    render(<CustomerPayoutDetailsPage />);

    fireEvent.click(screen.getByRole('button', { name: /select bank/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Access Bank' }));
    const input = screen.getByPlaceholderText('10-digit Account Number');
    fireEvent.change(input, { target: { value: '0123456789' } });
    fireEvent.click(verifyButton());
    expect(await screen.findByText('JANE DOE')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '012345678' } });
    expect(saveButton()).toBeDisabled();
  });

  it('strips non-digits from the account number and keeps Verify disabled below 10 digits', () => {
    render(<CustomerPayoutDetailsPage />);

    fireEvent.click(screen.getByRole('button', { name: /select bank/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Access Bank' }));

    const input = screen.getByPlaceholderText('10-digit Account Number') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '01ab23-45' } });
    expect(input.value).toBe('012345');
    expect(verifyButton()).toBeDisabled();
  });

  it('pre-marks the account as verified when saved details are hydrated from the API', () => {
    mockGetSettings.mockReturnValue({
      data: {
        success: true,
        data: {
          bank_name: 'GTBank',
          bank_code: '058',
          account_number: '9876543210',
          account_name: 'JOHN DOE',
          recipient_code: 'RCP_1',
          has_pin: true,
        },
      },
      isLoading: false,
    });

    render(<CustomerPayoutDetailsPage />);

    expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
    expect(saveButton()).not.toBeDisabled();
  });
});
