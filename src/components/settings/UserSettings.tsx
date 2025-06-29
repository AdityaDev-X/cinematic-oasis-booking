
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Settings, Globe, Volume2, Play, Bell, Shield, ArrowLeft } from 'lucide-react';

interface UserSettingsData {
  id?: string;
  language: string;
  subtitle_language: string;
  auto_play_next: boolean;
  auto_play_previews: boolean;
  playback_quality: string;
  download_quality: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  parental_controls: boolean;
  maturity_rating: string;
}

interface UserSettingsProps {
  onBack: () => void;
}

export const UserSettings = ({ onBack }: UserSettingsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettingsData>({
    language: 'en',
    subtitle_language: 'en',
    auto_play_next: true,
    auto_play_previews: true,
    playback_quality: 'auto',
    download_quality: 'standard',
    notifications_enabled: true,
    email_notifications: true,
    push_notifications: true,
    parental_controls: false,
    maturity_rating: 'all',
  });

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const settingsData = {
        ...settings,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('user_settings')
        .upsert(settingsData, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof UserSettingsData, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2 border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>
      </div>

      {/* Language & Accessibility */}
      <Card className="bg-black/80 border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Globe className="h-5 w-5" />
            Language & Accessibility
          </CardTitle>
          <CardDescription className="text-gray-300">
            Configure your language preferences and accessibility options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Display Language</Label>
              <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                <SelectTrigger className="bg-gray-800 border-red-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                  <SelectItem value="te">తెలుగు</SelectItem>
                  <SelectItem value="bn">বাংলা</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Subtitle Language</Label>
              <Select value={settings.subtitle_language} onValueChange={(value) => updateSetting('subtitle_language', value)}>
                <SelectTrigger className="bg-gray-800 border-red-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                  <SelectItem value="te">తెలుగు</SelectItem>
                  <SelectItem value="bn">বাংলা</SelectItem>
                  <SelectItem value="off">Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Playback Settings */}
      <Card className="bg-black/80 border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Play className="h-5 w-5" />
            Playback Settings
          </CardTitle>
          <CardDescription className="text-gray-300">
            Control your video playback experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">Auto-play next episode</Label>
              <p className="text-sm text-gray-500">Automatically play the next episode</p>
            </div>
            <Switch
              checked={settings.auto_play_next}
              onCheckedChange={(checked) => updateSetting('auto_play_next', checked)}
            />
          </div>
          <Separator className="bg-gray-700" />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">Auto-play previews</Label>
              <p className="text-sm text-gray-500">Play previews while browsing</p>
            </div>
            <Switch
              checked={settings.auto_play_previews}
              onCheckedChange={(checked) => updateSetting('auto_play_previews', checked)}
            />
          </div>
          <Separator className="bg-gray-700" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Video Quality</Label>
              <Select value={settings.playback_quality} onValueChange={(value) => updateSetting('playback_quality', value)}>
                <SelectTrigger className="bg-gray-800 border-red-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Download Quality</Label>
              <Select value={settings.download_quality} onValueChange={(value) => updateSetting('download_quality', value)}>
                <SelectTrigger className="bg-gray-800 border-red-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-black/80 border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription className="text-gray-300">
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">Enable Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications about new content</p>
            </div>
            <Switch
              checked={settings.notifications_enabled}
              onCheckedChange={(checked) => updateSetting('notifications_enabled', checked)}
            />
          </div>
          <Separator className="bg-gray-700" />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">Email Notifications</Label>
              <p className="text-sm text-gray-500">Get updates via email</p>
            </div>
            <Switch
              checked={settings.email_notifications}
              onCheckedChange={(checked) => updateSetting('email_notifications', checked)}
            />
          </div>
          <Separator className="bg-gray-700" />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">Push Notifications</Label>
              <p className="text-sm text-gray-500">Get push notifications on your device</p>
            </div>
            <Switch
              checked={settings.push_notifications}
              onCheckedChange={(checked) => updateSetting('push_notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Parental Controls */}
      <Card className="bg-black/80 border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5" />
            Parental Controls
          </CardTitle>
          <CardDescription className="text-gray-300">
            Control content accessibility and restrictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">Enable Parental Controls</Label>
              <p className="text-sm text-gray-500">Restrict content based on maturity ratings</p>
            </div>
            <Switch
              checked={settings.parental_controls}
              onCheckedChange={(checked) => updateSetting('parental_controls', checked)}
            />
          </div>
          <Separator className="bg-gray-700" />
          <div className="space-y-2">
            <Label className="text-gray-300">Maturity Rating</Label>
            <Select value={settings.maturity_rating} onValueChange={(value) => updateSetting('maturity_rating', value)}>
              <SelectTrigger className="bg-gray-800 border-red-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="teen">Teen (13+)</SelectItem>
                <SelectItem value="mature">Mature (18+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={saveSettings} 
          disabled={saving}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};
