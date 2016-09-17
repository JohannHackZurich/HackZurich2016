using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace StepClient.Common
{
    public class BindableBase : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        public bool SetProperty<T>(ref T storage, T value, [CallerMemberName] string name = "")
        {
            if (object.Equals(storage, value))
                return false;

            storage = value;

            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));

            return true;
        }
    }
}