'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCreateNotificationMutation } from '@/lib/api/adminApi';

export default function CreateNotification() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('Users');
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleOption, setScheduleOption] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');

  const [createNotification, { isLoading, isSuccess, isError, error }] =
    useCreateNotificationMutation();

  const scheduleOptions = [
    { id: 'tomorrow-morning', label: 'Tomorrow morning', time: '4th Dec, 8:00 AM', icon: '⚙️' },
    { id: 'tomorrow-afternoon', label: 'Tomorrow afternoon', time: '4th Dec, 12:00 PM', icon: '⚙️' },
    { id: 'monday-morning', label: 'Monday Morning', time: '8th Dec, 8:00 AM', icon: '📅' },
    { id: 'custom', label: 'Pick date & time', time: '', icon: '📅' },
  ];

  useEffect(() => {
    if (isSuccess) {
      alert('Notification created successfully!');
      router.back();
    }
    if (isError) {
      alert('Failed to create notification: ' + JSON.stringify(error));
    }
  }, [isSuccess, isError, error, router]);

  const handleSendNotification = async () => {
    await createNotification({
      title,
      message: description,
      recipient_type: recipient.toUpperCase() as "USERS" | "VENDORS" | "ALL",
      status: 'Sent',
    });
  };

  const handleSaveDraft = async () => {
    await createNotification({
      title,
      message: description,
      recipient_type: recipient.toUpperCase() as "USERS" | "VENDORS" | "ALL",
      status: 'Draft',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[600px] bg-white relative">
        <div className="min-h-screen bg-white pb-6">
          <div className="p-4 border-b border-gray-200 flex items-center justify-center relative">
            <button onClick={() => router.back()} className="absolute left-4">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-lg font-semibold text-system-blue-light">Create Notification</h1>
          </div>

          {!showSchedule ? (
            <div className="p-4">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-700 block mb-2">Notification Title</label>
                  <input
                    type="text"
                    placeholder="e.g., System Updates, Flash Sales Announcements..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 block mb-2">Notification Description</label>
                  <textarea
                    placeholder="Notification description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light min-h-[120px] resize-none"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 block mb-2">To:</label>
                  <select
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                    disabled={isLoading}
                  >
                    <option>Users</option>
                    <option>Vendors</option>
                    <option>All</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                <button 
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled
                >
                  <Upload className="w-4 h-4" />
                  Attach File
                </button>
                <button
                  onClick={() => setShowSchedule(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Notification
                </button>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleSendNotification}
                  className="w-full py-3 bg-system-blue-light text-white rounded-lg text-sm font-medium hover:bg-[#020360] transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Notification'}
                </button>

                <button 
                  onClick={handleSaveDraft}
                  className="w-full py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save as Draft'}
                </button>
              </div>
            </div>
          ) : scheduleOption === 'custom' && customDate ? (
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                Pick date & time
              </h2>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    placeholder="Dec 3rd, Wed"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    placeholder="3:30 PM"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setScheduleOption('');
                    setCustomDate('');
                    setCustomTime('');
                  }}
                  className="flex-1 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowSchedule(false);
                    setScheduleOption('');
                  }}
                  className="flex-1 py-3 bg-system-blue-light text-white rounded-lg text-sm font-medium hover:bg-[#020360] transition-colors"
                >
                  Schedule Notification
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {scheduleOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      if (option.id === 'custom') {
                        setScheduleOption('custom');
                        setCustomDate('Dec 3rd, Wed');
                      } else {
                        setScheduleOption(option.id);
                        setShowSchedule(false);
                      }
                    }}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-system-blue-light hover:bg-blue-50 transition-colors text-center"
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">{option.label}</p>
                    {option.time && <p className="text-xs text-gray-600">{option.time}</p>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
