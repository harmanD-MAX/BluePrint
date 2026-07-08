using Cassandra;

namespace Blueprint.Infrastructure.Data
{
    public interface IAstraDbService
    {
        ISession GetSession();
    }

    public class AstraDbService : IAstraDbService, IDisposable
    {
        private readonly ICluster _cluster;
        private readonly ISession _session;

        public AstraDbService(string secureConnectBundlePath, string clientId, string clientSecret, string keyspace)
        {
            // The SecureConnectBundle is used for DataStax Astra DB
            _cluster = Cluster.Builder()
                .WithCloudSecureConnectionBundle(secureConnectBundlePath)
                .WithCredentials(clientId, clientSecret)
                .Build();

            _session = _cluster.Connect(keyspace);
        }

        public ISession GetSession() => _session;

        public void Dispose()
        {
            _session?.Dispose();
            _cluster?.Dispose();
        }
    }
}
