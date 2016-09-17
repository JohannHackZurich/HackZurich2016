using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace StepClient.Common
{
    public class DelegateCommand<T> : ICommand
    {
        private Action<T> executeHandler;
        private Func<T, bool> canExecuteHandler;

        public DelegateCommand(Action<T> executeHandler, Func<T, bool> canExecuteHandler = null)
        {
            this.executeHandler = executeHandler;
            this.canExecuteHandler = canExecuteHandler;
        }

        public event EventHandler CanExecuteChanged;

        public bool CanExecute(object parameter)
        {
            if (canExecuteHandler != null)
                return canExecuteHandler((T)parameter);

            return true;
        }

        public void RaiseCanExecute()
        {
            CanExecuteChanged?.Invoke(this, new EventArgs());
        }

        public void Execute(object parameter)
        {
            executeHandler((T)parameter);
        }
    }
}
