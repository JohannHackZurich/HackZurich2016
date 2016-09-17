using Newtonsoft.Json;
using StepClient.Common;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using Windows.ApplicationModel.Core;
using Windows.Data.Json;
using Windows.Devices.Sensors;
using Windows.UI.Core;
using Windows.UI.Xaml;

namespace StepClient.ViewModels
{
    public class MainViewModel : BindableBase
    {
        public ICommand RegisterCommand { get; private set; }

        public ICommand StopCommand { get; private set; }

        public ICommand StartCommand { get; private set; }

        readonly ObservableCollection<string> log;

        bool isRunning = false;
        Guid id;
        CancellationTokenSource source;
        Uri baseAddress;
        public MainViewModel()
        {
            RegisterCommand = new DelegateCommand<object>(RegisterExecuteHandler);
            StartCommand = new DelegateCommand<object>(StartExecuteHandler, CanExecuteStartHandler);
            StopCommand = new DelegateCommand<object>(StopExecuteHandler, CanExecuteStopHandler);

            source = new CancellationTokenSource();

            baseAddress = new Uri(@"http://localhost:4440/api/");
            baseAddress = new Uri(@"http://hackzurich2016.azurewebsites.net/api/");

            log = new ObservableCollection<string>();
        }

        private void StopExecuteHandler(object obj)
        {
            source.Cancel();
            isRunning = false;

            (StartCommand as DelegateCommand<object>).RaiseCanExecute();
            (StopCommand as DelegateCommand<object>).RaiseCanExecute();
        }

        private bool CanExecuteStopHandler(object arg)
        {
            if (isRunning)
                return true;

            return false;
        }

        private bool CanExecuteStartHandler(object arg)
        {
            if (!register)
                return false;

            return !isRunning;
        }

        private async void StartExecuteHandler(object obj)
        {

            var pedometer = await Pedometer.GetDefaultAsync();
            var cr = pedometer.GetCurrentReadings();
            pedometer.ReportInterval = pedometer.MinimumReportInterval;

            pedometer.ReadingChanged += async (s, e) =>
            {
                await CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(CoreDispatcherPriority.Normal,
                () =>
            {
                switch (e.Reading.StepKind)
                {
                    case PedometerStepKind.Running:

                        RunningStepCount = e.Reading.CumulativeSteps;
                        break;
                    case PedometerStepKind.Walking:
                        WalkingStepCount = e.Reading.CumulativeSteps;
                        break;
                    case PedometerStepKind.Unknown:
                        UnknownStepCount = e.Reading.CumulativeSteps;
                        break;
                }
                TotalStepCount = RunningStepCount + WalkingStepCount + UnknownStepCount;
                Log.Add($"{DateTime.Now} {e.Reading.StepKind.ToString()} {e.Reading.CumulativeSteps}");
            });
                var data = await SendData();

                //ait StartAsync();
                isRunning = true;
                (StartCommand as DelegateCommand<object>).RaiseCanExecute();
                (StopCommand as DelegateCommand<object>).RaiseCanExecute();

            };
            }


        private async void RegisterExecuteHandler(object obj)
            {
                var clients = await GetClients();
                if (clients.Count() < 2)
                {
                    return;
                }

                id = clients.ElementAt(1).Id;

                register = true;

                (StartCommand as DelegateCommand<object>).RaiseCanExecute();
                (StopCommand as DelegateCommand<object>).RaiseCanExecute();
            }

            bool register = false;

        private string status;

        public string Status
        {
            get { return status; }
            set { SetProperty(ref status, value); }
        }

        private long runningStepCount;

        public long RunningStepCount
        {
            get { return runningStepCount; }
            set { SetProperty(ref runningStepCount, value); }
        }

        private long walkingStepCount;

        public long WalkingStepCount
        {
            get { return walkingStepCount; }
            set { SetProperty(ref walkingStepCount, value); }
        }

        private long unknownStepCount;

        public long UnknownStepCount
        {
            get { return unknownStepCount; }
            set { SetProperty(ref unknownStepCount, value); }
        }

        private long totalStepCount;

        public long TotalStepCount
        {
            get { return totalStepCount; }
            set { SetProperty(ref totalStepCount, value); }
        }

        public bool Player { get; private set; }

        public ObservableCollection<string> Log
        {
            get
            {
                return log;
            }
        }

        //public Task StartAsync()
        //{
        //    //return Task.Run(async () =>
        //    // {
        //    //     while (true)
        //    //     {
        //    //         await UpdateStepsAsync();
        //    //         var data = await SendData();
        //    //         await Task.Delay(1000);
        //    //     }
        //    // }, source.Token);
        //}

        private async Task UpdateStepsAsync()
        {
            //var pedometer = await Pedometer.GetDefaultAsync();
            //var cr = pedometer.GetCurrentReadings();
            //pedometer.ReportInterval = pedometer.MinimumReportInterval;

            //pedometer.ReadingChanged += async (s, e) =>
            //{
            //    await CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(CoreDispatcherPriority.Normal,
            //    () =>
            //{

            //    switch (e.Reading.StepKind)
            //    {
            //        case PedometerStepKind.Running:
            //            RunningStepCount = e.Reading.CumulativeSteps;
            //            break;
            //        case PedometerStepKind.Walking:
            //            WalkingStepCount = e.Reading.CumulativeSteps;
            //            break;
            //        case PedometerStepKind.Unknown:
            //            UnknownStepCount = e.Reading.CumulativeSteps;
            //            break;
            //    }
            //    TotalStepCount = RunningStepCount + WalkingStepCount + UnknownStepCount;
            //    Log.Add($"{DateTime.Now} {e.Reading.StepKind.ToString()} {e.Reading.CumulativeSteps}");
            //});
            //};




            //var history = await Pedometer.GetSystemHistoryAsync(DateTimeOffset.Now.AddDays(-1), TimeSpan.FromDays(1));

            //await CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(CoreDispatcherPriority.Normal,
            //    () =>
            //{
            //    if (history == null)
            //    {
            //        Status = "No steps found";
            //        return;
            //    }

            //    Status = string.Empty;

            //    var runningSteps = history.Where(r => r.StepKind == PedometerStepKind.Running).OrderBy(r => r.Timestamp);
            //    var walkingSteps = history.Where(w => w.StepKind == PedometerStepKind.Walking).OrderBy(w => w.Timestamp);
            //    var unknownSteps = history.Where(w => w.StepKind == PedometerStepKind.Unknown).OrderBy(w => w.Timestamp);

            //    if (runningSteps.Count() > 0)
            //        RunningStepCount = runningSteps.Last().CumulativeSteps;

            //    if (walkingSteps.Count() > 0)
            //        WalkingStepCount = walkingSteps.Last().CumulativeSteps;

            //    if (unknownSteps.Count() > 0)
            //        UnknownStepCount = unknownSteps.Last().CumulativeSteps;



            //Log.Add($"{DateTime.Now}: R{RunningStepCount} W{WalkingStepCount} U{UnknownStepCount}");
            //});
        }

        public async Task Login()
        {
            var client = new HttpClient();
            client.BaseAddress = baseAddress;

            object data = new { Name = "Mobile Device", InitSteps = 1000 };
            var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
            var result = await client.PostAsync("Players", content);
        }

        public async Task<IEnumerable<Player>> GetClients()
        {
            var client = new HttpClient();
            client.BaseAddress = baseAddress;

            var result = await client.GetAsync("Players");
            return JsonConvert.DeserializeObject<IEnumerable<Player>>(await result.Content.ReadAsStringAsync());
        }

        public async Task<Player> SendData()
        {
            var client = new HttpClient();
            client.BaseAddress = baseAddress;

            var result = await client.PutAsync($"Players/{id.ToString()}/Steps/{TotalStepCount}", new StringContent(""));
            return JsonConvert.DeserializeObject<Player>(await result.Content.ReadAsStringAsync());
        }
    }

    public class Player
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Steps { get; set; }
    }
}
