'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCreateNotificationMutation } from '@/lib/api/adminApi';
import toast from 'react-hot-toast';
import { addDays, nextMonday, setHours, setMinutes, format, isFuture } from 'date-fns';

export default function CreateNotification() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('Users');
  const [showSchedule, setShowSchedule] = useState(false);
  
  // Scheduling State
  const [scheduledDate, setScheduledDate] = useState(''); // YYYY-MM-DD
  const [scheduledTime, setScheduledTime] = useState(''); // HH:mm

  const [createNotification, { isLoading, isSuccess, isError, error }] =
    useCreateNotificationMutation();

  const scheduleOptions = [
    { 
      id: 'tomorrow-morning', 
      label: 'Tomorrow morning', 
      timeLabel: '8:00 AM', 
      icon: '☀️',
      getAction: () => {
        const d = addDays(new Date(), 1);
        return setMinutes(setHours(d, 8), 0);
      }
    },
    { 
      id: 'tomorrow-afternoon', 
      label: 'Tomorrow afternoon', 
      timeLabel: '12:00 PM', 
      icon: '🌤️',
      getAction: () => {
        const d = addDays(new Date(), 1);
        return setMinutes(setHours(d, 12), 0);
      }
    },
    { 
      id: 'monday-morning', 
      label: 'Monday Morning', 
      timeLabel: '8:00 AM', 
      icon: '📅',
      getAction: () => {
        const d = nextMonday(new Date());
        return setMinutes(setHours(d, 8), 0);
      }
    },
    { id: 'custom', label: 'Pick date & time', timeLabel: '', icon: '⚙️', getAction: () => null },
  ];

  useEffect(() => {
    if (isSuccess) {
      toast.success('Notification created successfully!');
      router.back();
    }
    if (isError) {
      toast.error('Failed to create notification: ' + JSON.stringify(error));
    }
  }, [isSuccess, isError, error, router]);

  const handlePresetSelect = (option: typeof scheduleOptions[0]) => {
    if (option.id === 'custom') {
      // Just show the custom picker
      setScheduledDate('');
      setScheduledTime('');
    } else {
      const date = option.getAction();
      if (date) {
        setScheduledDate(format(date, 'yyyy-MM-dd'));
        setScheduledTime(format(date, 'HH:mm'));
        toast.success(`Scheduled for ${format(date, 'MMM do, h:mm a')}`);
        setShowSchedule(true); // Keep schedule view open to show selected
      }
    }
  };

  const getISOString = () => {
    if (!scheduledDate || !scheduledTime) return null;
    const dateTimeString = `${scheduledDate}T${scheduledTime}`;
    const dateObj = new Date(dateTimeString);
    
    if (isNaN(dateObj.getTime())) {
      toast.error('Invalid date or time.');
      return null;
    }
    
    if (!isFuture(dateObj)) {
      toast.error('Scheduled time must be in the future.');
      return null;
    }

    return dateObj.toISOString();
  };

  const handleSendNotification = async () => {
    let scheduledFor = null;
    if (showSchedule) {
      scheduledFor = getISOString();
      if (!scheduledFor && (scheduledDate || scheduledTime)) return; // Validation failed
    }

    const commonBody = {
      title,
      message: description,
      priority: 'normal',
      is_draft: false,
      scheduled_for: scheduledFor,
    };

    if (recipient === 'all') {
      await createNotification({
        ...commonBody,
        recipient_type: 'ALL',
        recipient_group: 'all',
      });
    } else {
      await createNotification({
        ...commonBody,
        recipient_type: recipient === 'customer' ? 'USERS' : 'VENDORS',
        recipient_group: recipient === 'customer' ? 'customer' : 'vendor',
      });
    }
  };

  const handleSaveDraft = async () => {
    let scheduledFor = null;
    if (showSchedule) {
      scheduledFor = getISOString();
       if (!scheduledFor && (scheduledDate || scheduledTime)) return; // Validation failed
    }

    const commonBody = {
      title,
      message: description,
      priority: 'normal',
      is_draft: true,
      scheduled_for: scheduledFor,
    };

    if (recipient === 'all') {
      await createNotification({
        ...commonBody,
        recipient_type: 'ALL',
        recipient_group: 'all',
      });
    } else {
      await createNotification({
        ...commonBody,
        recipient_type: recipient === 'customer' ? 'USERS' : 'VENDORS',
        recipient_group: recipient === 'customer' ? 'customer' : 'vendor',
      });
    }
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
                    <option value="customer">Customers Only</option>
                    <option value="vendor">Vendors Only</option>
                    <option value="all">Everyone (Broadcast)</option>
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
                >
                  <Calendar className="w-4 h-4" />
                  {scheduledDate ? 'Edit Schedule' : 'Schedule Notification'}
                </button>
              </div>

              {scheduledDate && (
                 <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-system-blue-light uppercase tracking-wide">Scheduled For</span>
                      <p className="text-sm text-gray-900 mt-0.5">
                        {format(new Date(`${scheduledDate}T${scheduledTime}`), 'PPPP p')}
                      </p>
                    </div>
                    <button 
                      onClick={() => { setScheduledDate(''); setScheduledTime(''); }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                 </div>
              )}

              <div className="space-y-3">
                <button 
                  onClick={handleSendNotification}
                  className="w-full py-3 bg-system-blue-light text-white rounded-lg text-sm font-medium hover:bg-[#020360] transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : (scheduledDate ? 'Schedule Notification' : 'Send Notification')}
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
          ) : (
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                Schedule Notification
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {scheduleOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handlePresetSelect(option)}
                    className={`p-4 border-2 rounded-lg transition-colors text-center ${
                       option.id === 'custom' && scheduledDate && scheduledTime === '' ? 'border-system-blue-light bg-blue-50' : 'border-gray-200 hover:border-system-blue-light hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">{option.label}</p>
                    {option.timeLabel && <p className="text-xs text-gray-600">{option.timeLabel}</p>}
                  </button>
                ))}
              </div>

              {/* Custom Date Picker Area */}
              <div className="border-t border-gray-100 pt-6">
                 <p className="text-sm font-medium text-gray-700 mb-4">Or pick a specific time:</p>
                 <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Date</label>
                      <input 
                        type="date" 
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Time</label>
                      <input 
                        type="time" 
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light"
                      />
                    </div>
                 </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setShowSchedule(false);
                    // Don't clear state, just hide view, allows user to "cancel" editing schedule but keep previous selection if any? 
                    // Or strictly cancel? Let's treat as "Back"
                  }}
                  className="flex-1 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (!scheduledDate || !scheduledTime) {
                      toast.error('Please select a date and time');
                      return;
                    }
                    setShowSchedule(false);
                  }}
                  className="flex-1 py-3 bg-system-blue-light text-white rounded-lg text-sm font-medium hover:bg-[#020360] transition-colors"
                >
                  Confirm Schedule
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
